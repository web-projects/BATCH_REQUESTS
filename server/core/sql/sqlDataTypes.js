/**
 * Note:
 *  The aliasing in the SQL data types are meant to hide the implementation
 *  details of TEDIOUS so that an engineer can focus on the big picture of
 *  what they are trying to achieve.
 */
import { TYPES } from 'tedious';

// ===========================================================
// Exact Numerics
// ===========================================================
export const SqlBitType = TYPES.Bit;
export const SqlTinyIntType = TYPES.TinyInt;
export const SqlSmallIntType = TYPES.SmallInt;
export const SqlIntType = TYPES.Int;
/**
 * Values are returned as a string. This is because values can exceed
 * 53 bits of significant data, which is greater than a Javascript Number
 * type can represent as an integer
 */
export const SqlBigIntType = TYPES.BitInt;
/**
 * For input parameters involving numeric and decimal types, the default
 * precision is 18 and the default scale is 0. Maximum supported precision
 * is currently 19 at the moment.
 */
export const SqlNumericType = TYPES.Numeric;
export const SqlDecimalType = TYPES.Decimal;
export const SqlSmallMoneyType = TYPES.SmallMoney;
export const SqlMoneyType = TYPES.Money;

// ===========================================================
// Approximate Numerics
// ===========================================================
export const SqlFloatType = TYPES.Float;
export const SqlRealType = TYPES.Real;

// ===========================================================
// Date and Time
// ===========================================================
export const SqlSmallDateTimeType = TYPES.SmallDateTime;
export const SqlDateTimeType = TYPES.DateTime;
export const SqlDateTime2Type = TYPES.DateTime2;
export const SqlDateTimeOffset = TYPES.DateTimeOffset;
export const SqlTimeType = TYPES.Time;
export const SqlDateType = TYPES.Date;

// ===========================================================
// ANSI Character Strings
// ===========================================================
export const SqlCharType = TYPES.Char;
/**
 * Both varchar(max) and nvarchar(max) are supported by the library.
 */
export const SqlVarCharType = TYPES.VarChar;
export const SqlTextType = TYPES.Text;

// ===========================================================
// Unicode Character Strings
// ===========================================================
export const SqlNcharType = TYPES.NChar;
export const SqlNVarCharType = TYPES.NVarChar;
export const SqlNTextType = TYPES.NText;

// ===========================================================
// Binary Strings
// ===========================================================
export const SqlBinaryType = TYPES.Binary;
export const SqlVarBinaryType = TYPES.VarBinary;
export const SqlImageType = TYPES.Image;

// ===========================================================
// Other Data Types
// ===========================================================
export const SqlNullType = TYPES.Null;
export const SqlTvpType = TYPES.TVP;
export const SqlUdtType = TYPES.UDT;
/**
 * Values of this type are returned as a 16 byte hexadecimal string
 * and the ordering of the bytes is not necessarily the same as the
 * character representation.
 */
export const SqlUniqueIdentifierType = TYPES.UniqueIdentifier;
export const SqlVariantType = TYPES.Variant;
export const SqlXmlType = TYPES.Xml;
