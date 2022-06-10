import React from 'react';
import * as _ from 'underscore';
import ActionCreator from '../../actions/actionCreator';

const MAIN_SURFACE_ID = 'svg-network-container';
const MAIN_SURFACE_GROUP_ID = 'mainSurface';
const MAIN_LOADER_ID = 'network-container-loader';

const ChannelServiceType = {
    UnknownService: 0,
    Dal: 1,
    Servicer: 3,
    Receiver: 4,
    Monitor: 5,
    Processor: 6,
    CryptoCache: 7,
    Broker: 8,
    AppManager: 9,
    Updater: 10,
};

const ChannelTypes = {
    UnknownChannel: 0,
    NamedPipes: 1,
    WebSocket: 2,
    LongPoll: 3,
    AzureServiceBus: 4,
    Isomorphic: 5,
};

let weakSelf;

export default class ConnectionCanvasVisualizer extends React.Component {
    constructor(props) {
        super(props);
        this.simulation = null;
        this.svg = null;
        this.verticeNodes = null;
        this.marker = null;
        this.linkNodes = null;
        this.dataSetMap = null;
        this.drag = null;
        this.resizeFeedback = {
            width: 0,
            height: 0,
        };
        this.dataSet = {
            nodeMap: null,
            nodeIdSet: null,
            nodes: [],
            edges: [],
        };
        this.options = {
            dataRefreshIntervalId: 0,
            showAllRelationships: false,
        };
        this.debouncedSurfaceResize = _.debounce((width, height) => {
            this.hideLoader();

            this.simulation.stop();
            this.simulation.force('center', d3.forceCenter().x(width / 2).y(height / 2));
            this.simulation.restart();

            d3.select(`#${MAIN_SURFACE_ID} svg`)
                .attr('viewBox', `0 0 ${width} ${height}`);

            d3.selectAll('g.node').each((d, i) => {
                if (d.fx) {
                    delete d.fx;
                }
                if (d.fy) {
                    delete d.fy;
                }
            });

            d3.selectAll('g.node')
                .attr('transform', (d) => `translate(${d.x}, ${d.y})`);
         }, 512);

         weakSelf = this;
         this.actionCreator = new ActionCreator();
    }

    componentDidMount() {
        this.createCommBrokerNetworkLayout();
    }

    render() {
        return (
          <div id="svg-network-container">
          </div>
        );
    }

    periodicallyScanConnections() {
        const self = this;
        this.options.dataRefreshIntervalId = setInterval(() => {
            self.actionCreator.getConnectionData().then((result) => {
                const { nodeMap, edges } = self.normalizeCommBrokerData(result);
                self.refreshCanvasWithUpdates(nodeMap, edges);
            })
            .catch((err) => {
                console.log('An error occurred while checking for new connections.');
            });
        }, 10000);
    }

    findUpdatedDataDiffs(nodes) {
        const intermediateSet = new Set(_.pluck(nodes, 'ConnectionId'));
        const addedNodes = [].concat([...intermediateSet].filter((p) => !this.dataSet.nodeIdSet.has(p)));
        const oldNodes = [].concat([...this.dataSet.nodeIdSet].filter((p) => !intermediateSet.has(p)));

        return {
            addedNodes,
            oldNodes,
            intermediateSet,
        };
    }

    refreshCanvasWithUpdates(nodeMap, newEdges) {
        const { nodes } = this.filterNodesAndEdges(nodeMap, newEdges);
        const { addedNodes, oldNodes, intermediateSet } = this.findUpdatedDataDiffs(nodes);

        if (addedNodes.length === 0 && oldNodes.length === 0) {
            return;
        }

        this.dataSet.nodeMap = nodeMap;
        this.dataSet.nodeIdSet = intermediateSet;

        for (let i = 0; i < addedNodes.length; ++i) {
            const targetConnectionId = this.dataSet.nodeMap[addedNodes[i]].BrokerOwnerId;
            this.dataSet.nodes.push(this.dataSet.nodeMap[addedNodes[i]]);
            this.dataSet.edges.push({
                source: this.dataSet.nodeMap[addedNodes[i]],
                target: this.findNodeByConnectionId(this.dataSet.nodes, targetConnectionId),
                weight: 5,
            });
        }

        // TODO: Optimize the following piece of code so it's
        // a lot more performant after we have had a good cup of coffee.
        for (let i = 0; i < oldNodes.length; ++i) {
            for (let j = 0; j < this.dataSet.nodes.length; ++j) {
                if (this.dataSet.nodes[j].ConnectionId === oldNodes[i]) {
                    this.dataSet.nodes.splice(j, 1);
                    break;
                }
            }
            for (let x = 0; x < this.dataSet.edges.length; ++x) {
                if (this.dataSet.edges[x].source.ConnectionId === oldNodes[i]
                    || this.dataSet.edges[x].target.ConnectionId === oldNodes[i]) {
                        this.dataSet.edges.splice(x, 1);
                    break;
                }
            }
        }

        this.invalidateSurface(nodeMap);
    }

    findNodeByConnectionId(nodes, targetId) {
        let targetNode = null;
        nodes.forEach((node) => {
            if (node.ConnectionId === targetId) {
                targetNode = node;
            }
        });
        return targetNode;
    }

    invalidateSurface(nodeMap) {
        this.simulation.stop();

        const roleScale = this.createColorRoleScale(nodeMap);

        // Re-establish all of the edges.
        this.linkNodes = this.svg.selectAll('line.link')
            .data(this.dataSet.edges, (d) => `${d.source.ConnectionId}-${d.target.ConnectionId}`);

        this.linkNodes
            .exit()
            .transition()
            .duration(512)
            .ease(d3.easeCubic)
            .attr('stroke-capacity', 0)
            .attrTween('x1', (d) => () => d.source.x)
            .attrTween('x2', (d) => () => d.target.x)
            .attrTween('y1', (d) => () => d.source.y)
            .attrTween('y2', (d) => () => d.target.y)
            .style('opacity', 0)
            .remove();

        this.linkNodes = this.linkNodes
          .enter()
          .append('line')
          .style('opacity', 0)
          .transition()
          .duration(512)
          .ease(d3.easeCubic)
          .style('opacity', 1)
          .attr('class', 'link');

        this.linkNodes
            .call(d3.zoomTransform)
            .merge(this.linkNodes);

        d3.selectAll('line')
          .attr('marker-end', 'url(#triangle)')
          .lower();

        // Re-establish all of the nodes.
        this.verticeNodes = this.svg.selectAll('g.node')
            .data(this.dataSet.nodes, (d) => d.ConnectionId);

        this.verticeNodes
            .exit()
            .transition()
            .duration(1024)
            .ease(d3.easeCubic)
            .attr('r', 0)
            .style('opacity', 0)
            .remove();

        this.verticeNodes = this.verticeNodes
            .enter()
            .append('g')
            .attr('class', 'node')
            .on('mousedown', () => d3.event.stopPropagation());

        this.verticeNodes
            .append('circle')
            .style('opacity', 0)
            .transition()
            .duration(512)
            .ease(d3.easeCubic)
            .attr('r', 8)
            .style('opacity', 1)
            .style('fill', (d) => roleScale(d.CompanyId));

        this.verticeNodes
            .append('text')
            .attr('class', 'cv-text')
            .attr('y', 22)
            .text((d) => d.Username);

        d3.selectAll('g.node')
            .call(this.drag);

        this.simulation.nodes(this.dataSet.nodes);
        this.simulation.force('link').links(this.dataSet.edges);

        // Re-heat the simulation and restart the network.
        this.forceSurfaceRefresh();
    }

    createCommBrokerNetworkLayout() {
        this.actionCreator.getConnectionData().then((result) => {
            const { nodeMap, edges } = this.normalizeCommBrokerData(result);
            this.createForceDirectedLayout(nodeMap, edges);
            this.periodicallyScanConnections();
        })
        .catch((err) => {
            /* To Do:  Display some error */
        });
    }

    normalizeCommBrokerData(jsonObject) {
        return {
            edges: this.buildNetworkEdges(jsonObject.objectMap, jsonObject.adjacencyList),
            nodeMap: this.fixCompanyAssociations(jsonObject.objectMap),
        };
     }

     buildNetworkEdges(objectMap, adjacencyList) {
        if (adjacencyList === null || adjacencyList === undefined || adjacencyList.length === 0) {
            return [];
        }

        const edges = [];

        Object.keys(adjacencyList).forEach((key) => {
            if (objectMap[key]) {
               for (let i = 0; i < adjacencyList[key].length; ++i) {
                   if (objectMap[adjacencyList[key][i]] && this.simpleCycleCheck(objectMap[adjacencyList[key][i]])) {
                       edges.push({
                           source: key,
                           target: adjacencyList[key][i],
                           weight: 5,
                       });
                   } else {
                       // Relationships from a broker to a dependent component is illegal.
                       // console.log(`[WARNING]: Invalid path detected from ${key} to ${adjacencyList[key][i]}.`);
                   }
               }
            } else {
                console.log(`[WARNING] Unable to find target ${key} in object map`);
            }
        });

        return edges;
    }

    simpleCycleCheck(dest) {
        return dest.ServiceTypeId === ChannelServiceType.Broker;
    }

    refreshSurfaceIfNecessary() {
        if (this.simulation.alpha() < 0.1) {
           this.forceSurfaceRefresh();
        }
    }

    createColorRoleScale(nodeMap) {
        const associativeIds = this.findUniqueCompanies(nodeMap);
        return d3.scaleOrdinal()
            .domain(associativeIds)
            .range(d3.schemeCategory10)
            .unknown('#c4b9ac');
    }

    filterNodesAndEdges(nodeMap, edges) {
        edges.forEach((edge) => {
            edge.weight = parseInt(edge.weight, 10);
            edge.source = nodeMap[edge.source];
            edge.target = nodeMap[edge.target];
        });

        edges = _.filter(edges, (edge) => edge.source.ServiceTypeId === ChannelServiceType.Broker || edge.source.IsCloud);

        const nodes = _.filter(_.toArray(nodeMap), (node) => node.ServiceTypeId === ChannelServiceType.Broker || node.IsCloud);

       /**
        * There is closeness centrality, eigenvector centrality,
        * between-ness centrality and degree centrality.
        * For our simulation we are going to utilize degree centrality
        * to help grow the core nodes in our graph that have the
        * greater total number of links that are connected to them.
        */
       nodes.forEach((d) => {
            d.degreeCentrality = edges.filter((p) => p.source === d || p.target === d).length;
        });

        return {
            nodes,
            edges,
        };
    }

    createForceDirectedLayout(nodeMap, edges) {
        const width = $(`#${MAIN_SURFACE_ID}`).width();
        const height = $(`#${MAIN_SURFACE_ID}`).height();

        console.log(`Initial surface size set to ({${width}, ${height}})`);

        // Attach a handler for surface zooming.
        const zoomHandler = d3.zoom()
           .scaleExtent([0.3, 20])
           .on('zoom', this.handleSurfaceZoom);

       // Setup the main viewbox so the min-x/min-y meet as the
       // desired aspect ratio to preserve. This will be refreshed
       // to provide a smooth double buffered effect on most browsers.
       const svgSurface = d3.select(`#${MAIN_SURFACE_ID}`)
           .append('svg')
           .attr('preserveAspectRatio', 'xMinYMin meet')
           .attr('viewBox', `0 0 ${width} ${height}`)
           .attr('class', 'svg-network-surface')
           .call(zoomHandler);

       this.svg = svgSurface
           .append('g')
           .attr('id', MAIN_SURFACE_GROUP_ID);

       /**
        * Filter out the nodes appropriately so that it will show the
        * correct corresponding data based on user options.
        */
       const normalizedData = this.filterNodesAndEdges(nodeMap, edges);
       const { nodes } = normalizedData;
       const normalizedEdges = normalizedData.edges;

       /**
        * Keep track of the dataset changes since it will become useful
        * when we need to need update the surface using the update pattern.
        */
       this.dataSet.nodeMap = nodeMap;
       this.dataSet.nodeIdSet = new Set(_.pluck(nodes, 'ConnectionId'));
       this.dataSet.nodes = [].concat(nodes);
       this.dataSet.edges = [].concat(normalizedEdges);

       const roleScale = this.createColorRoleScale(nodeMap);

       const networkLinkForce = d3.forceLink().strength((d) => d.weight * 0.1);
       const networkCenterOfGravity = d3.forceCenter().x(width / 2).y(height / 2);

       /**
        * Our simulation world that we render in will have a
        * positive exerting force, that does its best to repel
        * nodes so we have a decent spread across the canvas.
        * We also set a radius around the collision to prevent
        * node overlapping properties that occur in a cluster.
        *
        * We also update our simulation on a per tick basis
        * to ensure things are rendered smoothly as nodes
        * arrive or disappear.
        */
       this.simulation = d3.forceSimulation()
           .force('charge', d3.forceManyBody().strength(-5000))
           .force('collision', d3.forceCollide(12))
           .force('center', networkCenterOfGravity)
           .force('x', d3.forceX(-250))
           .force('y', d3.forceY(-250))
           .force('link', networkLinkForce)
           .nodes(nodes)
           .on('tick', this.handleSimulationTick);

       this.simulation.force('link')
           .links(normalizedEdges);

       this.linkNodes = this.svg.selectAll('line.link');

       this.linkNodes
           .data(normalizedEdges, (d) => `${d.source.ConnectionId}-${d.target.ConnectionId}`)
           .enter()
           .append('line')
           .attr('class', 'link')
           .call(d3.zoomTransform);

       this.verticeNodes = this.svg.selectAll('g.node');

       const nodeEnter = this.verticeNodes
           .data(nodes, (d) => d.ConnectionId)
           .enter()
           .append('g')
           .attr('class', 'node')
           .on('mousedown', () => d3.event.stopPropagation());

       nodeEnter.append('circle')
           .transition()
           .attr('r', 8)
           .style('fill', (d) => roleScale(d.CompanyId));

       nodeEnter.append('text')
           .transition()
           .attr('class', 'cv-text')
           .attr('y', 22)
           .text((d) => d.Username);

       /**
        * Without an SVG Marker our network looks like an undirected
        * graph which is not correct. All nodes are directed and
        * weighted.
        */
       this.marker = this.svg
           .append('defs')
           .append('marker')
           .attr('id', 'triangle')
           .attr('refX', 12)
           .attr('refY', 6)
           .attr('markerUnits', 'userSpaceOnUse')
           .attr('markerWidth', 8)
           .attr('markerHeight', 12)
           .attr('orient', 'auto')
           .append('path')
           .attr('d', 'M 0 0 12 6 0 12 3 6');

       d3.selectAll('line')
           .attr('marker-end', 'url(#triangle)');

       // Handle node dragging on the surface and attach listener to all nodes.
       this.drag = d3.drag();
       this.drag.on('drag', this.handleNodeDragging);

       d3.selectAll("g.node").call(this.drag);

       // Handle canvas resizing using debouncing :-)
       $(window).on('resize', () => {
           const w = $(`#${MAIN_SURFACE_ID}`).width();
           const h = $(`#${MAIN_SURFACE_ID}`).height();

           if (this.resizeFeedback.width !== w || this.resizeFeedback.height !== h) {
               this.resizeFeedback.width = w;
               this.resizeFeedback.height = h;

               d3.select(`#${MAIN_SURFACE_ID} svg`)
                   .attr('viewBox', '1 1 1 1');

               this.showLoader(w, h);

               this.debouncedSurfaceResize(w, h);
           }
       });
    }

    findUniqueCompanies(nodeMap) {
        const seen = new Map();

        Object.keys(nodeMap).forEach((key) => {
            if (!seen.has(nodeMap[key].CompanyId) && nodeMap[key].CompanyId > 0) {
                seen.set(nodeMap[key].CompanyId, 1);
            }
        });

        return Array.from(seen.keys());
     }

     handleNodeDragging(d) {
        const e = d3.event;

        d.fx = e.x;
        d.fy = e.y;

        weakSelf.refreshSurfaceIfNecessary();
    }

    handleSimulationTick() {
       d3.selectAll('line.link')
           .attr('x1', (d) => d.source.x)
           .attr('x2', (d) => d.target.x)
           .attr('y1', (d) => d.source.y)
           .attr('y2', (d) => d.target.y);

       d3.selectAll('g.node')
           .attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    }

    handleSurfaceZoom() {
        // Translate from the origin SVG space into the normalized
        // dot product on the cartesean plane with K as our transform 
        // vector that describes both the magnitude and direction
        // relative to (mx, my) / 2 - k/1.
        d3.select(`#${MAIN_SURFACE_GROUP_ID}`)
            .attr("transform", "translate(" + d3.event.transform.x+","+d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
    }

    forceSurfaceRefresh() {
        this.simulation.alpha(0.1);
        this.simulation.restart();
    }

    fixCompanyAssociations(objectMap) {
        // ToDo: remove companyId 0 check once Brokers start registering as with CompanyId
        Object.keys(objectMap).forEach((key) => {
            if (!objectMap[key].IsCloud && objectMap[key].ServiceTypeId !== ChannelServiceType.Broker && objectMap[key].CompanyId > 0) {
               if (objectMap[objectMap[key].BrokerOwnerId]) {
                   objectMap[objectMap[key].BrokerOwnerId].CompanyId = objectMap[key].CompanyId;
               }
            }
        });
        return objectMap;
    }

    serviceTypeToStr(serviceTypeId) {
        switch (serviceTypeId) {
            case ChannelServiceType.AppManager:
                return 'AppManager';
            case ChannelServiceType.Broker:
                return 'Broker';
            case ChannelServiceType.CryptoCache:
                return 'CryptoCache';
            case ChannelServiceType.Dal:
                return 'Dal';
            case ChannelServiceType.Monitor:
                return 'Monitor';
            case ChannelServiceType.Processor:
                return 'Processor';
            case ChannelServiceType.Receiver:
                return 'Receiver';
            case ChannelServiceType.Servicer:
                return 'Servicer';
            case ChannelServiceType.Updater:
                return 'Updater';
            default:
                return 'UnknownService';
        }
    }

    isCloudToBit(isCloud) {
        return isCloud ? '1' : '0';
    }

    hideLoader() {
        d3.select(`#${MAIN_LOADER_ID}`).remove();
    }

    showLoader(width, height) {
        this.hideLoader();

        const mainSurface = d3.select(`#${MAIN_SURFACE_ID}`);
        const loaderSurface = mainSurface.insert('svg', ':first-child')
            .attr('version', '1.1')
            .attr('id', 'network-container-loader')
            .attr('xmlns', 'http://www.w3.ord/2000/svg')
            .attr('xmlns:xlink', 'http://www.w3.ord/1999/xlink')
            .attr('xml:space', 'preserve')
            .attr('enable-background', 'new 0 0 0 0')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('background-color', 'white');

        const loaderGroup = loaderSurface.append('g')
            .attr('transform', `translate(${width / 2 - 50}, ${height / 2})`)
            .style('background-color', '#FFFFFF')
            .style('height', '100%')
            .style('width', '100%');

        const circleAttributes = {
            xSpread: [
                6,
                26,
                46,
            ],
            y: 50,
            styles: [
                'fill',
                'stroke',
            ],
            animationSpread: [
                0.1,
                0.2,
                0.3,
            ],
        };

        for (let i = 0; i < circleAttributes.xSpread.length; ++i) {
            const c = loaderGroup.append('circle')
                .attr('cx', circleAttributes.xSpread[i])
                .attr('cy', circleAttributes.y)
                .attr('r', 6)
                .style('fill', '#000000')
                .style('stroke', '#000000');

            c.append('animate')
                .attr('attributeName', 'opacity')
                .attr('dur', '1s')
                .attr('values', '0;1;0')
                .attr('repeatCount', 'indefinite')
                .attr('begin', circleAttributes.animationSpread[i]);
        }
    }
}
