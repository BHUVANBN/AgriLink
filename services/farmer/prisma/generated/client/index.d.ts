
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model FarmerProfile
 * 
 */
export type FarmerProfile = $Result.DefaultSelection<Prisma.$FarmerProfilePayload>
/**
 * Model LandAgreementIndex
 * 
 */
export type LandAgreementIndex = $Result.DefaultSelection<Prisma.$LandAgreementIndexPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more FarmerProfiles
 * const farmerProfiles = await prisma.farmerProfile.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more FarmerProfiles
   * const farmerProfiles = await prisma.farmerProfile.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.farmerProfile`: Exposes CRUD operations for the **FarmerProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FarmerProfiles
    * const farmerProfiles = await prisma.farmerProfile.findMany()
    * ```
    */
  get farmerProfile(): Prisma.FarmerProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.landAgreementIndex`: Exposes CRUD operations for the **LandAgreementIndex** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LandAgreementIndices
    * const landAgreementIndices = await prisma.landAgreementIndex.findMany()
    * ```
    */
  get landAgreementIndex(): Prisma.LandAgreementIndexDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    FarmerProfile: 'FarmerProfile',
    LandAgreementIndex: 'LandAgreementIndex'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "farmerProfile" | "landAgreementIndex"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      FarmerProfile: {
        payload: Prisma.$FarmerProfilePayload<ExtArgs>
        fields: Prisma.FarmerProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FarmerProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FarmerProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          findFirst: {
            args: Prisma.FarmerProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FarmerProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          findMany: {
            args: Prisma.FarmerProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>[]
          }
          create: {
            args: Prisma.FarmerProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          createMany: {
            args: Prisma.FarmerProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FarmerProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>[]
          }
          delete: {
            args: Prisma.FarmerProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          update: {
            args: Prisma.FarmerProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          deleteMany: {
            args: Prisma.FarmerProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FarmerProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FarmerProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>[]
          }
          upsert: {
            args: Prisma.FarmerProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FarmerProfilePayload>
          }
          aggregate: {
            args: Prisma.FarmerProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFarmerProfile>
          }
          groupBy: {
            args: Prisma.FarmerProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<FarmerProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.FarmerProfileCountArgs<ExtArgs>
            result: $Utils.Optional<FarmerProfileCountAggregateOutputType> | number
          }
        }
      }
      LandAgreementIndex: {
        payload: Prisma.$LandAgreementIndexPayload<ExtArgs>
        fields: Prisma.LandAgreementIndexFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LandAgreementIndexFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandAgreementIndexPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LandAgreementIndexFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandAgreementIndexPayload>
          }
          findFirst: {
            args: Prisma.LandAgreementIndexFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandAgreementIndexPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LandAgreementIndexFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandAgreementIndexPayload>
          }
          findMany: {
            args: Prisma.LandAgreementIndexFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandAgreementIndexPayload>[]
          }
          create: {
            args: Prisma.LandAgreementIndexCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandAgreementIndexPayload>
          }
          createMany: {
            args: Prisma.LandAgreementIndexCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LandAgreementIndexCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandAgreementIndexPayload>[]
          }
          delete: {
            args: Prisma.LandAgreementIndexDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandAgreementIndexPayload>
          }
          update: {
            args: Prisma.LandAgreementIndexUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandAgreementIndexPayload>
          }
          deleteMany: {
            args: Prisma.LandAgreementIndexDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LandAgreementIndexUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LandAgreementIndexUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandAgreementIndexPayload>[]
          }
          upsert: {
            args: Prisma.LandAgreementIndexUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandAgreementIndexPayload>
          }
          aggregate: {
            args: Prisma.LandAgreementIndexAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLandAgreementIndex>
          }
          groupBy: {
            args: Prisma.LandAgreementIndexGroupByArgs<ExtArgs>
            result: $Utils.Optional<LandAgreementIndexGroupByOutputType>[]
          }
          count: {
            args: Prisma.LandAgreementIndexCountArgs<ExtArgs>
            result: $Utils.Optional<LandAgreementIndexCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    farmerProfile?: FarmerProfileOmit
    landAgreementIndex?: LandAgreementIndexOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model FarmerProfile
   */

  export type AggregateFarmerProfile = {
    _count: FarmerProfileCountAggregateOutputType | null
    _avg: FarmerProfileAvgAggregateOutputType | null
    _sum: FarmerProfileSumAggregateOutputType | null
    _min: FarmerProfileMinAggregateOutputType | null
    _max: FarmerProfileMaxAggregateOutputType | null
  }

  export type FarmerProfileAvgAggregateOutputType = {
    annualIncomeINR: number | null
    totalExtentAcres: number | null
    centerLat: number | null
    centerLng: number | null
    nameMatchConfidence: number | null
  }

  export type FarmerProfileSumAggregateOutputType = {
    annualIncomeINR: number | null
    totalExtentAcres: number | null
    centerLat: number | null
    centerLng: number | null
    nameMatchConfidence: number | null
  }

  export type FarmerProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    userMongoId: string | null
    ethAddress: string | null
    annualIncomeINR: number | null
    nameEnglish: string | null
    nameKannada: string | null
    nameDisplay: string | null
    nameNormalized: string | null
    dob: string | null
    gender: string | null
    aadhaarAddress: string | null
    aadhaarVerified: boolean | null
    aadhaarDocCid: string | null
    aadhaarCloudUrl: string | null
    district: string | null
    taluk: string | null
    hobli: string | null
    village: string | null
    surveyNumber: string | null
    hissaNumber: string | null
    totalExtentRaw: string | null
    totalExtentAcres: number | null
    soilType: string | null
    irrigationType: string | null
    rtcOwnerName: string | null
    rtcVerified: boolean | null
    rtcDocCid: string | null
    rtcCloudUrl: string | null
    landSketchUrl: string | null
    centerLat: number | null
    centerLng: number | null
    nameMatchConfidence: number | null
    nameMatchStatus: string | null
    kycStatus: string | null
    kycSubmittedAt: Date | null
    kycApprovedAt: Date | null
    kycRejectedAt: Date | null
    kycRejectionReason: string | null
    readyToIntegrate: boolean | null
    landOwnershipType: string | null
    casteCategory: string | null
    isIncomeTaxPayer: boolean | null
    isGovtEmployee: boolean | null
    hasKCC: boolean | null
    hasAadhaarLinkedBank: boolean | null
    hasLivestock: boolean | null
    farmingType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FarmerProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    userMongoId: string | null
    ethAddress: string | null
    annualIncomeINR: number | null
    nameEnglish: string | null
    nameKannada: string | null
    nameDisplay: string | null
    nameNormalized: string | null
    dob: string | null
    gender: string | null
    aadhaarAddress: string | null
    aadhaarVerified: boolean | null
    aadhaarDocCid: string | null
    aadhaarCloudUrl: string | null
    district: string | null
    taluk: string | null
    hobli: string | null
    village: string | null
    surveyNumber: string | null
    hissaNumber: string | null
    totalExtentRaw: string | null
    totalExtentAcres: number | null
    soilType: string | null
    irrigationType: string | null
    rtcOwnerName: string | null
    rtcVerified: boolean | null
    rtcDocCid: string | null
    rtcCloudUrl: string | null
    landSketchUrl: string | null
    centerLat: number | null
    centerLng: number | null
    nameMatchConfidence: number | null
    nameMatchStatus: string | null
    kycStatus: string | null
    kycSubmittedAt: Date | null
    kycApprovedAt: Date | null
    kycRejectedAt: Date | null
    kycRejectionReason: string | null
    readyToIntegrate: boolean | null
    landOwnershipType: string | null
    casteCategory: string | null
    isIncomeTaxPayer: boolean | null
    isGovtEmployee: boolean | null
    hasKCC: boolean | null
    hasAadhaarLinkedBank: boolean | null
    hasLivestock: boolean | null
    farmingType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FarmerProfileCountAggregateOutputType = {
    id: number
    userId: number
    userMongoId: number
    ethAddress: number
    annualIncomeINR: number
    nameEnglish: number
    nameKannada: number
    nameDisplay: number
    nameNormalized: number
    dob: number
    gender: number
    aadhaarAddress: number
    aadhaarVerified: number
    aadhaarDocCid: number
    aadhaarCloudUrl: number
    district: number
    taluk: number
    hobli: number
    village: number
    surveyNumber: number
    hissaNumber: number
    totalExtentRaw: number
    totalExtentAcres: number
    soilType: number
    irrigationType: number
    rtcOwnerName: number
    rtcVerified: number
    rtcDocCid: number
    rtcCloudUrl: number
    landSketchUrl: number
    landBoundary: number
    centerLat: number
    centerLng: number
    nameMatchConfidence: number
    nameMatchStatus: number
    kycStatus: number
    kycSubmittedAt: number
    kycApprovedAt: number
    kycRejectedAt: number
    kycRejectionReason: number
    readyToIntegrate: number
    landOwnershipType: number
    casteCategory: number
    isIncomeTaxPayer: number
    isGovtEmployee: number
    hasKCC: number
    hasAadhaarLinkedBank: number
    hasLivestock: number
    farmingType: number
    cropsGrown: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FarmerProfileAvgAggregateInputType = {
    annualIncomeINR?: true
    totalExtentAcres?: true
    centerLat?: true
    centerLng?: true
    nameMatchConfidence?: true
  }

  export type FarmerProfileSumAggregateInputType = {
    annualIncomeINR?: true
    totalExtentAcres?: true
    centerLat?: true
    centerLng?: true
    nameMatchConfidence?: true
  }

  export type FarmerProfileMinAggregateInputType = {
    id?: true
    userId?: true
    userMongoId?: true
    ethAddress?: true
    annualIncomeINR?: true
    nameEnglish?: true
    nameKannada?: true
    nameDisplay?: true
    nameNormalized?: true
    dob?: true
    gender?: true
    aadhaarAddress?: true
    aadhaarVerified?: true
    aadhaarDocCid?: true
    aadhaarCloudUrl?: true
    district?: true
    taluk?: true
    hobli?: true
    village?: true
    surveyNumber?: true
    hissaNumber?: true
    totalExtentRaw?: true
    totalExtentAcres?: true
    soilType?: true
    irrigationType?: true
    rtcOwnerName?: true
    rtcVerified?: true
    rtcDocCid?: true
    rtcCloudUrl?: true
    landSketchUrl?: true
    centerLat?: true
    centerLng?: true
    nameMatchConfidence?: true
    nameMatchStatus?: true
    kycStatus?: true
    kycSubmittedAt?: true
    kycApprovedAt?: true
    kycRejectedAt?: true
    kycRejectionReason?: true
    readyToIntegrate?: true
    landOwnershipType?: true
    casteCategory?: true
    isIncomeTaxPayer?: true
    isGovtEmployee?: true
    hasKCC?: true
    hasAadhaarLinkedBank?: true
    hasLivestock?: true
    farmingType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FarmerProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    userMongoId?: true
    ethAddress?: true
    annualIncomeINR?: true
    nameEnglish?: true
    nameKannada?: true
    nameDisplay?: true
    nameNormalized?: true
    dob?: true
    gender?: true
    aadhaarAddress?: true
    aadhaarVerified?: true
    aadhaarDocCid?: true
    aadhaarCloudUrl?: true
    district?: true
    taluk?: true
    hobli?: true
    village?: true
    surveyNumber?: true
    hissaNumber?: true
    totalExtentRaw?: true
    totalExtentAcres?: true
    soilType?: true
    irrigationType?: true
    rtcOwnerName?: true
    rtcVerified?: true
    rtcDocCid?: true
    rtcCloudUrl?: true
    landSketchUrl?: true
    centerLat?: true
    centerLng?: true
    nameMatchConfidence?: true
    nameMatchStatus?: true
    kycStatus?: true
    kycSubmittedAt?: true
    kycApprovedAt?: true
    kycRejectedAt?: true
    kycRejectionReason?: true
    readyToIntegrate?: true
    landOwnershipType?: true
    casteCategory?: true
    isIncomeTaxPayer?: true
    isGovtEmployee?: true
    hasKCC?: true
    hasAadhaarLinkedBank?: true
    hasLivestock?: true
    farmingType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FarmerProfileCountAggregateInputType = {
    id?: true
    userId?: true
    userMongoId?: true
    ethAddress?: true
    annualIncomeINR?: true
    nameEnglish?: true
    nameKannada?: true
    nameDisplay?: true
    nameNormalized?: true
    dob?: true
    gender?: true
    aadhaarAddress?: true
    aadhaarVerified?: true
    aadhaarDocCid?: true
    aadhaarCloudUrl?: true
    district?: true
    taluk?: true
    hobli?: true
    village?: true
    surveyNumber?: true
    hissaNumber?: true
    totalExtentRaw?: true
    totalExtentAcres?: true
    soilType?: true
    irrigationType?: true
    rtcOwnerName?: true
    rtcVerified?: true
    rtcDocCid?: true
    rtcCloudUrl?: true
    landSketchUrl?: true
    landBoundary?: true
    centerLat?: true
    centerLng?: true
    nameMatchConfidence?: true
    nameMatchStatus?: true
    kycStatus?: true
    kycSubmittedAt?: true
    kycApprovedAt?: true
    kycRejectedAt?: true
    kycRejectionReason?: true
    readyToIntegrate?: true
    landOwnershipType?: true
    casteCategory?: true
    isIncomeTaxPayer?: true
    isGovtEmployee?: true
    hasKCC?: true
    hasAadhaarLinkedBank?: true
    hasLivestock?: true
    farmingType?: true
    cropsGrown?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FarmerProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FarmerProfile to aggregate.
     */
    where?: FarmerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmerProfiles to fetch.
     */
    orderBy?: FarmerProfileOrderByWithRelationInput | FarmerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FarmerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FarmerProfiles
    **/
    _count?: true | FarmerProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FarmerProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FarmerProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FarmerProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FarmerProfileMaxAggregateInputType
  }

  export type GetFarmerProfileAggregateType<T extends FarmerProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateFarmerProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFarmerProfile[P]>
      : GetScalarType<T[P], AggregateFarmerProfile[P]>
  }




  export type FarmerProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FarmerProfileWhereInput
    orderBy?: FarmerProfileOrderByWithAggregationInput | FarmerProfileOrderByWithAggregationInput[]
    by: FarmerProfileScalarFieldEnum[] | FarmerProfileScalarFieldEnum
    having?: FarmerProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FarmerProfileCountAggregateInputType | true
    _avg?: FarmerProfileAvgAggregateInputType
    _sum?: FarmerProfileSumAggregateInputType
    _min?: FarmerProfileMinAggregateInputType
    _max?: FarmerProfileMaxAggregateInputType
  }

  export type FarmerProfileGroupByOutputType = {
    id: string
    userId: string
    userMongoId: string | null
    ethAddress: string | null
    annualIncomeINR: number | null
    nameEnglish: string | null
    nameKannada: string | null
    nameDisplay: string | null
    nameNormalized: string | null
    dob: string | null
    gender: string | null
    aadhaarAddress: string | null
    aadhaarVerified: boolean
    aadhaarDocCid: string | null
    aadhaarCloudUrl: string | null
    district: string | null
    taluk: string | null
    hobli: string | null
    village: string | null
    surveyNumber: string | null
    hissaNumber: string | null
    totalExtentRaw: string | null
    totalExtentAcres: number | null
    soilType: string | null
    irrigationType: string | null
    rtcOwnerName: string | null
    rtcVerified: boolean
    rtcDocCid: string | null
    rtcCloudUrl: string | null
    landSketchUrl: string | null
    landBoundary: JsonValue | null
    centerLat: number | null
    centerLng: number | null
    nameMatchConfidence: number | null
    nameMatchStatus: string
    kycStatus: string
    kycSubmittedAt: Date | null
    kycApprovedAt: Date | null
    kycRejectedAt: Date | null
    kycRejectionReason: string | null
    readyToIntegrate: boolean
    landOwnershipType: string | null
    casteCategory: string | null
    isIncomeTaxPayer: boolean
    isGovtEmployee: boolean
    hasKCC: boolean
    hasAadhaarLinkedBank: boolean
    hasLivestock: boolean
    farmingType: string
    cropsGrown: string[]
    createdAt: Date
    updatedAt: Date
    _count: FarmerProfileCountAggregateOutputType | null
    _avg: FarmerProfileAvgAggregateOutputType | null
    _sum: FarmerProfileSumAggregateOutputType | null
    _min: FarmerProfileMinAggregateOutputType | null
    _max: FarmerProfileMaxAggregateOutputType | null
  }

  type GetFarmerProfileGroupByPayload<T extends FarmerProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FarmerProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FarmerProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FarmerProfileGroupByOutputType[P]>
            : GetScalarType<T[P], FarmerProfileGroupByOutputType[P]>
        }
      >
    >


  export type FarmerProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userMongoId?: boolean
    ethAddress?: boolean
    annualIncomeINR?: boolean
    nameEnglish?: boolean
    nameKannada?: boolean
    nameDisplay?: boolean
    nameNormalized?: boolean
    dob?: boolean
    gender?: boolean
    aadhaarAddress?: boolean
    aadhaarVerified?: boolean
    aadhaarDocCid?: boolean
    aadhaarCloudUrl?: boolean
    district?: boolean
    taluk?: boolean
    hobli?: boolean
    village?: boolean
    surveyNumber?: boolean
    hissaNumber?: boolean
    totalExtentRaw?: boolean
    totalExtentAcres?: boolean
    soilType?: boolean
    irrigationType?: boolean
    rtcOwnerName?: boolean
    rtcVerified?: boolean
    rtcDocCid?: boolean
    rtcCloudUrl?: boolean
    landSketchUrl?: boolean
    landBoundary?: boolean
    centerLat?: boolean
    centerLng?: boolean
    nameMatchConfidence?: boolean
    nameMatchStatus?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycApprovedAt?: boolean
    kycRejectedAt?: boolean
    kycRejectionReason?: boolean
    readyToIntegrate?: boolean
    landOwnershipType?: boolean
    casteCategory?: boolean
    isIncomeTaxPayer?: boolean
    isGovtEmployee?: boolean
    hasKCC?: boolean
    hasAadhaarLinkedBank?: boolean
    hasLivestock?: boolean
    farmingType?: boolean
    cropsGrown?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["farmerProfile"]>

  export type FarmerProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userMongoId?: boolean
    ethAddress?: boolean
    annualIncomeINR?: boolean
    nameEnglish?: boolean
    nameKannada?: boolean
    nameDisplay?: boolean
    nameNormalized?: boolean
    dob?: boolean
    gender?: boolean
    aadhaarAddress?: boolean
    aadhaarVerified?: boolean
    aadhaarDocCid?: boolean
    aadhaarCloudUrl?: boolean
    district?: boolean
    taluk?: boolean
    hobli?: boolean
    village?: boolean
    surveyNumber?: boolean
    hissaNumber?: boolean
    totalExtentRaw?: boolean
    totalExtentAcres?: boolean
    soilType?: boolean
    irrigationType?: boolean
    rtcOwnerName?: boolean
    rtcVerified?: boolean
    rtcDocCid?: boolean
    rtcCloudUrl?: boolean
    landSketchUrl?: boolean
    landBoundary?: boolean
    centerLat?: boolean
    centerLng?: boolean
    nameMatchConfidence?: boolean
    nameMatchStatus?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycApprovedAt?: boolean
    kycRejectedAt?: boolean
    kycRejectionReason?: boolean
    readyToIntegrate?: boolean
    landOwnershipType?: boolean
    casteCategory?: boolean
    isIncomeTaxPayer?: boolean
    isGovtEmployee?: boolean
    hasKCC?: boolean
    hasAadhaarLinkedBank?: boolean
    hasLivestock?: boolean
    farmingType?: boolean
    cropsGrown?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["farmerProfile"]>

  export type FarmerProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userMongoId?: boolean
    ethAddress?: boolean
    annualIncomeINR?: boolean
    nameEnglish?: boolean
    nameKannada?: boolean
    nameDisplay?: boolean
    nameNormalized?: boolean
    dob?: boolean
    gender?: boolean
    aadhaarAddress?: boolean
    aadhaarVerified?: boolean
    aadhaarDocCid?: boolean
    aadhaarCloudUrl?: boolean
    district?: boolean
    taluk?: boolean
    hobli?: boolean
    village?: boolean
    surveyNumber?: boolean
    hissaNumber?: boolean
    totalExtentRaw?: boolean
    totalExtentAcres?: boolean
    soilType?: boolean
    irrigationType?: boolean
    rtcOwnerName?: boolean
    rtcVerified?: boolean
    rtcDocCid?: boolean
    rtcCloudUrl?: boolean
    landSketchUrl?: boolean
    landBoundary?: boolean
    centerLat?: boolean
    centerLng?: boolean
    nameMatchConfidence?: boolean
    nameMatchStatus?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycApprovedAt?: boolean
    kycRejectedAt?: boolean
    kycRejectionReason?: boolean
    readyToIntegrate?: boolean
    landOwnershipType?: boolean
    casteCategory?: boolean
    isIncomeTaxPayer?: boolean
    isGovtEmployee?: boolean
    hasKCC?: boolean
    hasAadhaarLinkedBank?: boolean
    hasLivestock?: boolean
    farmingType?: boolean
    cropsGrown?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["farmerProfile"]>

  export type FarmerProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    userMongoId?: boolean
    ethAddress?: boolean
    annualIncomeINR?: boolean
    nameEnglish?: boolean
    nameKannada?: boolean
    nameDisplay?: boolean
    nameNormalized?: boolean
    dob?: boolean
    gender?: boolean
    aadhaarAddress?: boolean
    aadhaarVerified?: boolean
    aadhaarDocCid?: boolean
    aadhaarCloudUrl?: boolean
    district?: boolean
    taluk?: boolean
    hobli?: boolean
    village?: boolean
    surveyNumber?: boolean
    hissaNumber?: boolean
    totalExtentRaw?: boolean
    totalExtentAcres?: boolean
    soilType?: boolean
    irrigationType?: boolean
    rtcOwnerName?: boolean
    rtcVerified?: boolean
    rtcDocCid?: boolean
    rtcCloudUrl?: boolean
    landSketchUrl?: boolean
    landBoundary?: boolean
    centerLat?: boolean
    centerLng?: boolean
    nameMatchConfidence?: boolean
    nameMatchStatus?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycApprovedAt?: boolean
    kycRejectedAt?: boolean
    kycRejectionReason?: boolean
    readyToIntegrate?: boolean
    landOwnershipType?: boolean
    casteCategory?: boolean
    isIncomeTaxPayer?: boolean
    isGovtEmployee?: boolean
    hasKCC?: boolean
    hasAadhaarLinkedBank?: boolean
    hasLivestock?: boolean
    farmingType?: boolean
    cropsGrown?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FarmerProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "userMongoId" | "ethAddress" | "annualIncomeINR" | "nameEnglish" | "nameKannada" | "nameDisplay" | "nameNormalized" | "dob" | "gender" | "aadhaarAddress" | "aadhaarVerified" | "aadhaarDocCid" | "aadhaarCloudUrl" | "district" | "taluk" | "hobli" | "village" | "surveyNumber" | "hissaNumber" | "totalExtentRaw" | "totalExtentAcres" | "soilType" | "irrigationType" | "rtcOwnerName" | "rtcVerified" | "rtcDocCid" | "rtcCloudUrl" | "landSketchUrl" | "landBoundary" | "centerLat" | "centerLng" | "nameMatchConfidence" | "nameMatchStatus" | "kycStatus" | "kycSubmittedAt" | "kycApprovedAt" | "kycRejectedAt" | "kycRejectionReason" | "readyToIntegrate" | "landOwnershipType" | "casteCategory" | "isIncomeTaxPayer" | "isGovtEmployee" | "hasKCC" | "hasAadhaarLinkedBank" | "hasLivestock" | "farmingType" | "cropsGrown" | "createdAt" | "updatedAt", ExtArgs["result"]["farmerProfile"]>

  export type $FarmerProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FarmerProfile"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      userMongoId: string | null
      ethAddress: string | null
      annualIncomeINR: number | null
      nameEnglish: string | null
      nameKannada: string | null
      nameDisplay: string | null
      nameNormalized: string | null
      dob: string | null
      gender: string | null
      aadhaarAddress: string | null
      aadhaarVerified: boolean
      aadhaarDocCid: string | null
      aadhaarCloudUrl: string | null
      district: string | null
      taluk: string | null
      hobli: string | null
      village: string | null
      surveyNumber: string | null
      hissaNumber: string | null
      totalExtentRaw: string | null
      totalExtentAcres: number | null
      soilType: string | null
      irrigationType: string | null
      rtcOwnerName: string | null
      rtcVerified: boolean
      rtcDocCid: string | null
      rtcCloudUrl: string | null
      landSketchUrl: string | null
      landBoundary: Prisma.JsonValue | null
      centerLat: number | null
      centerLng: number | null
      nameMatchConfidence: number | null
      nameMatchStatus: string
      kycStatus: string
      kycSubmittedAt: Date | null
      kycApprovedAt: Date | null
      kycRejectedAt: Date | null
      kycRejectionReason: string | null
      readyToIntegrate: boolean
      landOwnershipType: string | null
      casteCategory: string | null
      isIncomeTaxPayer: boolean
      isGovtEmployee: boolean
      hasKCC: boolean
      hasAadhaarLinkedBank: boolean
      hasLivestock: boolean
      farmingType: string
      cropsGrown: string[]
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["farmerProfile"]>
    composites: {}
  }

  type FarmerProfileGetPayload<S extends boolean | null | undefined | FarmerProfileDefaultArgs> = $Result.GetResult<Prisma.$FarmerProfilePayload, S>

  type FarmerProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FarmerProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FarmerProfileCountAggregateInputType | true
    }

  export interface FarmerProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FarmerProfile'], meta: { name: 'FarmerProfile' } }
    /**
     * Find zero or one FarmerProfile that matches the filter.
     * @param {FarmerProfileFindUniqueArgs} args - Arguments to find a FarmerProfile
     * @example
     * // Get one FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FarmerProfileFindUniqueArgs>(args: SelectSubset<T, FarmerProfileFindUniqueArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FarmerProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FarmerProfileFindUniqueOrThrowArgs} args - Arguments to find a FarmerProfile
     * @example
     * // Get one FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FarmerProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, FarmerProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FarmerProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileFindFirstArgs} args - Arguments to find a FarmerProfile
     * @example
     * // Get one FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FarmerProfileFindFirstArgs>(args?: SelectSubset<T, FarmerProfileFindFirstArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FarmerProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileFindFirstOrThrowArgs} args - Arguments to find a FarmerProfile
     * @example
     * // Get one FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FarmerProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, FarmerProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FarmerProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FarmerProfiles
     * const farmerProfiles = await prisma.farmerProfile.findMany()
     * 
     * // Get first 10 FarmerProfiles
     * const farmerProfiles = await prisma.farmerProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const farmerProfileWithIdOnly = await prisma.farmerProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FarmerProfileFindManyArgs>(args?: SelectSubset<T, FarmerProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FarmerProfile.
     * @param {FarmerProfileCreateArgs} args - Arguments to create a FarmerProfile.
     * @example
     * // Create one FarmerProfile
     * const FarmerProfile = await prisma.farmerProfile.create({
     *   data: {
     *     // ... data to create a FarmerProfile
     *   }
     * })
     * 
     */
    create<T extends FarmerProfileCreateArgs>(args: SelectSubset<T, FarmerProfileCreateArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FarmerProfiles.
     * @param {FarmerProfileCreateManyArgs} args - Arguments to create many FarmerProfiles.
     * @example
     * // Create many FarmerProfiles
     * const farmerProfile = await prisma.farmerProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FarmerProfileCreateManyArgs>(args?: SelectSubset<T, FarmerProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FarmerProfiles and returns the data saved in the database.
     * @param {FarmerProfileCreateManyAndReturnArgs} args - Arguments to create many FarmerProfiles.
     * @example
     * // Create many FarmerProfiles
     * const farmerProfile = await prisma.farmerProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FarmerProfiles and only return the `id`
     * const farmerProfileWithIdOnly = await prisma.farmerProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FarmerProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, FarmerProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FarmerProfile.
     * @param {FarmerProfileDeleteArgs} args - Arguments to delete one FarmerProfile.
     * @example
     * // Delete one FarmerProfile
     * const FarmerProfile = await prisma.farmerProfile.delete({
     *   where: {
     *     // ... filter to delete one FarmerProfile
     *   }
     * })
     * 
     */
    delete<T extends FarmerProfileDeleteArgs>(args: SelectSubset<T, FarmerProfileDeleteArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FarmerProfile.
     * @param {FarmerProfileUpdateArgs} args - Arguments to update one FarmerProfile.
     * @example
     * // Update one FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FarmerProfileUpdateArgs>(args: SelectSubset<T, FarmerProfileUpdateArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FarmerProfiles.
     * @param {FarmerProfileDeleteManyArgs} args - Arguments to filter FarmerProfiles to delete.
     * @example
     * // Delete a few FarmerProfiles
     * const { count } = await prisma.farmerProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FarmerProfileDeleteManyArgs>(args?: SelectSubset<T, FarmerProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FarmerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FarmerProfiles
     * const farmerProfile = await prisma.farmerProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FarmerProfileUpdateManyArgs>(args: SelectSubset<T, FarmerProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FarmerProfiles and returns the data updated in the database.
     * @param {FarmerProfileUpdateManyAndReturnArgs} args - Arguments to update many FarmerProfiles.
     * @example
     * // Update many FarmerProfiles
     * const farmerProfile = await prisma.farmerProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FarmerProfiles and only return the `id`
     * const farmerProfileWithIdOnly = await prisma.farmerProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FarmerProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, FarmerProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FarmerProfile.
     * @param {FarmerProfileUpsertArgs} args - Arguments to update or create a FarmerProfile.
     * @example
     * // Update or create a FarmerProfile
     * const farmerProfile = await prisma.farmerProfile.upsert({
     *   create: {
     *     // ... data to create a FarmerProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FarmerProfile we want to update
     *   }
     * })
     */
    upsert<T extends FarmerProfileUpsertArgs>(args: SelectSubset<T, FarmerProfileUpsertArgs<ExtArgs>>): Prisma__FarmerProfileClient<$Result.GetResult<Prisma.$FarmerProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FarmerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileCountArgs} args - Arguments to filter FarmerProfiles to count.
     * @example
     * // Count the number of FarmerProfiles
     * const count = await prisma.farmerProfile.count({
     *   where: {
     *     // ... the filter for the FarmerProfiles we want to count
     *   }
     * })
    **/
    count<T extends FarmerProfileCountArgs>(
      args?: Subset<T, FarmerProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FarmerProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FarmerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FarmerProfileAggregateArgs>(args: Subset<T, FarmerProfileAggregateArgs>): Prisma.PrismaPromise<GetFarmerProfileAggregateType<T>>

    /**
     * Group by FarmerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmerProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FarmerProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FarmerProfileGroupByArgs['orderBy'] }
        : { orderBy?: FarmerProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FarmerProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFarmerProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FarmerProfile model
   */
  readonly fields: FarmerProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FarmerProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FarmerProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FarmerProfile model
   */
  interface FarmerProfileFieldRefs {
    readonly id: FieldRef<"FarmerProfile", 'String'>
    readonly userId: FieldRef<"FarmerProfile", 'String'>
    readonly userMongoId: FieldRef<"FarmerProfile", 'String'>
    readonly ethAddress: FieldRef<"FarmerProfile", 'String'>
    readonly annualIncomeINR: FieldRef<"FarmerProfile", 'Float'>
    readonly nameEnglish: FieldRef<"FarmerProfile", 'String'>
    readonly nameKannada: FieldRef<"FarmerProfile", 'String'>
    readonly nameDisplay: FieldRef<"FarmerProfile", 'String'>
    readonly nameNormalized: FieldRef<"FarmerProfile", 'String'>
    readonly dob: FieldRef<"FarmerProfile", 'String'>
    readonly gender: FieldRef<"FarmerProfile", 'String'>
    readonly aadhaarAddress: FieldRef<"FarmerProfile", 'String'>
    readonly aadhaarVerified: FieldRef<"FarmerProfile", 'Boolean'>
    readonly aadhaarDocCid: FieldRef<"FarmerProfile", 'String'>
    readonly aadhaarCloudUrl: FieldRef<"FarmerProfile", 'String'>
    readonly district: FieldRef<"FarmerProfile", 'String'>
    readonly taluk: FieldRef<"FarmerProfile", 'String'>
    readonly hobli: FieldRef<"FarmerProfile", 'String'>
    readonly village: FieldRef<"FarmerProfile", 'String'>
    readonly surveyNumber: FieldRef<"FarmerProfile", 'String'>
    readonly hissaNumber: FieldRef<"FarmerProfile", 'String'>
    readonly totalExtentRaw: FieldRef<"FarmerProfile", 'String'>
    readonly totalExtentAcres: FieldRef<"FarmerProfile", 'Float'>
    readonly soilType: FieldRef<"FarmerProfile", 'String'>
    readonly irrigationType: FieldRef<"FarmerProfile", 'String'>
    readonly rtcOwnerName: FieldRef<"FarmerProfile", 'String'>
    readonly rtcVerified: FieldRef<"FarmerProfile", 'Boolean'>
    readonly rtcDocCid: FieldRef<"FarmerProfile", 'String'>
    readonly rtcCloudUrl: FieldRef<"FarmerProfile", 'String'>
    readonly landSketchUrl: FieldRef<"FarmerProfile", 'String'>
    readonly landBoundary: FieldRef<"FarmerProfile", 'Json'>
    readonly centerLat: FieldRef<"FarmerProfile", 'Float'>
    readonly centerLng: FieldRef<"FarmerProfile", 'Float'>
    readonly nameMatchConfidence: FieldRef<"FarmerProfile", 'Float'>
    readonly nameMatchStatus: FieldRef<"FarmerProfile", 'String'>
    readonly kycStatus: FieldRef<"FarmerProfile", 'String'>
    readonly kycSubmittedAt: FieldRef<"FarmerProfile", 'DateTime'>
    readonly kycApprovedAt: FieldRef<"FarmerProfile", 'DateTime'>
    readonly kycRejectedAt: FieldRef<"FarmerProfile", 'DateTime'>
    readonly kycRejectionReason: FieldRef<"FarmerProfile", 'String'>
    readonly readyToIntegrate: FieldRef<"FarmerProfile", 'Boolean'>
    readonly landOwnershipType: FieldRef<"FarmerProfile", 'String'>
    readonly casteCategory: FieldRef<"FarmerProfile", 'String'>
    readonly isIncomeTaxPayer: FieldRef<"FarmerProfile", 'Boolean'>
    readonly isGovtEmployee: FieldRef<"FarmerProfile", 'Boolean'>
    readonly hasKCC: FieldRef<"FarmerProfile", 'Boolean'>
    readonly hasAadhaarLinkedBank: FieldRef<"FarmerProfile", 'Boolean'>
    readonly hasLivestock: FieldRef<"FarmerProfile", 'Boolean'>
    readonly farmingType: FieldRef<"FarmerProfile", 'String'>
    readonly cropsGrown: FieldRef<"FarmerProfile", 'String[]'>
    readonly createdAt: FieldRef<"FarmerProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"FarmerProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FarmerProfile findUnique
   */
  export type FarmerProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Filter, which FarmerProfile to fetch.
     */
    where: FarmerProfileWhereUniqueInput
  }

  /**
   * FarmerProfile findUniqueOrThrow
   */
  export type FarmerProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Filter, which FarmerProfile to fetch.
     */
    where: FarmerProfileWhereUniqueInput
  }

  /**
   * FarmerProfile findFirst
   */
  export type FarmerProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Filter, which FarmerProfile to fetch.
     */
    where?: FarmerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmerProfiles to fetch.
     */
    orderBy?: FarmerProfileOrderByWithRelationInput | FarmerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FarmerProfiles.
     */
    cursor?: FarmerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FarmerProfiles.
     */
    distinct?: FarmerProfileScalarFieldEnum | FarmerProfileScalarFieldEnum[]
  }

  /**
   * FarmerProfile findFirstOrThrow
   */
  export type FarmerProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Filter, which FarmerProfile to fetch.
     */
    where?: FarmerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmerProfiles to fetch.
     */
    orderBy?: FarmerProfileOrderByWithRelationInput | FarmerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FarmerProfiles.
     */
    cursor?: FarmerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FarmerProfiles.
     */
    distinct?: FarmerProfileScalarFieldEnum | FarmerProfileScalarFieldEnum[]
  }

  /**
   * FarmerProfile findMany
   */
  export type FarmerProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Filter, which FarmerProfiles to fetch.
     */
    where?: FarmerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FarmerProfiles to fetch.
     */
    orderBy?: FarmerProfileOrderByWithRelationInput | FarmerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FarmerProfiles.
     */
    cursor?: FarmerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FarmerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FarmerProfiles.
     */
    skip?: number
    distinct?: FarmerProfileScalarFieldEnum | FarmerProfileScalarFieldEnum[]
  }

  /**
   * FarmerProfile create
   */
  export type FarmerProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * The data needed to create a FarmerProfile.
     */
    data: XOR<FarmerProfileCreateInput, FarmerProfileUncheckedCreateInput>
  }

  /**
   * FarmerProfile createMany
   */
  export type FarmerProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FarmerProfiles.
     */
    data: FarmerProfileCreateManyInput | FarmerProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FarmerProfile createManyAndReturn
   */
  export type FarmerProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * The data used to create many FarmerProfiles.
     */
    data: FarmerProfileCreateManyInput | FarmerProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FarmerProfile update
   */
  export type FarmerProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * The data needed to update a FarmerProfile.
     */
    data: XOR<FarmerProfileUpdateInput, FarmerProfileUncheckedUpdateInput>
    /**
     * Choose, which FarmerProfile to update.
     */
    where: FarmerProfileWhereUniqueInput
  }

  /**
   * FarmerProfile updateMany
   */
  export type FarmerProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FarmerProfiles.
     */
    data: XOR<FarmerProfileUpdateManyMutationInput, FarmerProfileUncheckedUpdateManyInput>
    /**
     * Filter which FarmerProfiles to update
     */
    where?: FarmerProfileWhereInput
    /**
     * Limit how many FarmerProfiles to update.
     */
    limit?: number
  }

  /**
   * FarmerProfile updateManyAndReturn
   */
  export type FarmerProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * The data used to update FarmerProfiles.
     */
    data: XOR<FarmerProfileUpdateManyMutationInput, FarmerProfileUncheckedUpdateManyInput>
    /**
     * Filter which FarmerProfiles to update
     */
    where?: FarmerProfileWhereInput
    /**
     * Limit how many FarmerProfiles to update.
     */
    limit?: number
  }

  /**
   * FarmerProfile upsert
   */
  export type FarmerProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * The filter to search for the FarmerProfile to update in case it exists.
     */
    where: FarmerProfileWhereUniqueInput
    /**
     * In case the FarmerProfile found by the `where` argument doesn't exist, create a new FarmerProfile with this data.
     */
    create: XOR<FarmerProfileCreateInput, FarmerProfileUncheckedCreateInput>
    /**
     * In case the FarmerProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FarmerProfileUpdateInput, FarmerProfileUncheckedUpdateInput>
  }

  /**
   * FarmerProfile delete
   */
  export type FarmerProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
    /**
     * Filter which FarmerProfile to delete.
     */
    where: FarmerProfileWhereUniqueInput
  }

  /**
   * FarmerProfile deleteMany
   */
  export type FarmerProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FarmerProfiles to delete
     */
    where?: FarmerProfileWhereInput
    /**
     * Limit how many FarmerProfiles to delete.
     */
    limit?: number
  }

  /**
   * FarmerProfile without action
   */
  export type FarmerProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmerProfile
     */
    select?: FarmerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FarmerProfile
     */
    omit?: FarmerProfileOmit<ExtArgs> | null
  }


  /**
   * Model LandAgreementIndex
   */

  export type AggregateLandAgreementIndex = {
    _count: LandAgreementIndexCountAggregateOutputType | null
    _min: LandAgreementIndexMinAggregateOutputType | null
    _max: LandAgreementIndexMaxAggregateOutputType | null
  }

  export type LandAgreementIndexMinAggregateOutputType = {
    id: string | null
    agreementId: string | null
    creatorUserId: string | null
    partnerUserId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type LandAgreementIndexMaxAggregateOutputType = {
    id: string | null
    agreementId: string | null
    creatorUserId: string | null
    partnerUserId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type LandAgreementIndexCountAggregateOutputType = {
    id: number
    agreementId: number
    creatorUserId: number
    partnerUserId: number
    status: number
    createdAt: number
    _all: number
  }


  export type LandAgreementIndexMinAggregateInputType = {
    id?: true
    agreementId?: true
    creatorUserId?: true
    partnerUserId?: true
    status?: true
    createdAt?: true
  }

  export type LandAgreementIndexMaxAggregateInputType = {
    id?: true
    agreementId?: true
    creatorUserId?: true
    partnerUserId?: true
    status?: true
    createdAt?: true
  }

  export type LandAgreementIndexCountAggregateInputType = {
    id?: true
    agreementId?: true
    creatorUserId?: true
    partnerUserId?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type LandAgreementIndexAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LandAgreementIndex to aggregate.
     */
    where?: LandAgreementIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandAgreementIndices to fetch.
     */
    orderBy?: LandAgreementIndexOrderByWithRelationInput | LandAgreementIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LandAgreementIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandAgreementIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandAgreementIndices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LandAgreementIndices
    **/
    _count?: true | LandAgreementIndexCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LandAgreementIndexMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LandAgreementIndexMaxAggregateInputType
  }

  export type GetLandAgreementIndexAggregateType<T extends LandAgreementIndexAggregateArgs> = {
        [P in keyof T & keyof AggregateLandAgreementIndex]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLandAgreementIndex[P]>
      : GetScalarType<T[P], AggregateLandAgreementIndex[P]>
  }




  export type LandAgreementIndexGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LandAgreementIndexWhereInput
    orderBy?: LandAgreementIndexOrderByWithAggregationInput | LandAgreementIndexOrderByWithAggregationInput[]
    by: LandAgreementIndexScalarFieldEnum[] | LandAgreementIndexScalarFieldEnum
    having?: LandAgreementIndexScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LandAgreementIndexCountAggregateInputType | true
    _min?: LandAgreementIndexMinAggregateInputType
    _max?: LandAgreementIndexMaxAggregateInputType
  }

  export type LandAgreementIndexGroupByOutputType = {
    id: string
    agreementId: string
    creatorUserId: string
    partnerUserId: string
    status: string
    createdAt: Date
    _count: LandAgreementIndexCountAggregateOutputType | null
    _min: LandAgreementIndexMinAggregateOutputType | null
    _max: LandAgreementIndexMaxAggregateOutputType | null
  }

  type GetLandAgreementIndexGroupByPayload<T extends LandAgreementIndexGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LandAgreementIndexGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LandAgreementIndexGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LandAgreementIndexGroupByOutputType[P]>
            : GetScalarType<T[P], LandAgreementIndexGroupByOutputType[P]>
        }
      >
    >


  export type LandAgreementIndexSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agreementId?: boolean
    creatorUserId?: boolean
    partnerUserId?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["landAgreementIndex"]>

  export type LandAgreementIndexSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agreementId?: boolean
    creatorUserId?: boolean
    partnerUserId?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["landAgreementIndex"]>

  export type LandAgreementIndexSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agreementId?: boolean
    creatorUserId?: boolean
    partnerUserId?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["landAgreementIndex"]>

  export type LandAgreementIndexSelectScalar = {
    id?: boolean
    agreementId?: boolean
    creatorUserId?: boolean
    partnerUserId?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type LandAgreementIndexOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "agreementId" | "creatorUserId" | "partnerUserId" | "status" | "createdAt", ExtArgs["result"]["landAgreementIndex"]>

  export type $LandAgreementIndexPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LandAgreementIndex"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agreementId: string
      creatorUserId: string
      partnerUserId: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["landAgreementIndex"]>
    composites: {}
  }

  type LandAgreementIndexGetPayload<S extends boolean | null | undefined | LandAgreementIndexDefaultArgs> = $Result.GetResult<Prisma.$LandAgreementIndexPayload, S>

  type LandAgreementIndexCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LandAgreementIndexFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LandAgreementIndexCountAggregateInputType | true
    }

  export interface LandAgreementIndexDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LandAgreementIndex'], meta: { name: 'LandAgreementIndex' } }
    /**
     * Find zero or one LandAgreementIndex that matches the filter.
     * @param {LandAgreementIndexFindUniqueArgs} args - Arguments to find a LandAgreementIndex
     * @example
     * // Get one LandAgreementIndex
     * const landAgreementIndex = await prisma.landAgreementIndex.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LandAgreementIndexFindUniqueArgs>(args: SelectSubset<T, LandAgreementIndexFindUniqueArgs<ExtArgs>>): Prisma__LandAgreementIndexClient<$Result.GetResult<Prisma.$LandAgreementIndexPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LandAgreementIndex that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LandAgreementIndexFindUniqueOrThrowArgs} args - Arguments to find a LandAgreementIndex
     * @example
     * // Get one LandAgreementIndex
     * const landAgreementIndex = await prisma.landAgreementIndex.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LandAgreementIndexFindUniqueOrThrowArgs>(args: SelectSubset<T, LandAgreementIndexFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LandAgreementIndexClient<$Result.GetResult<Prisma.$LandAgreementIndexPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LandAgreementIndex that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandAgreementIndexFindFirstArgs} args - Arguments to find a LandAgreementIndex
     * @example
     * // Get one LandAgreementIndex
     * const landAgreementIndex = await prisma.landAgreementIndex.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LandAgreementIndexFindFirstArgs>(args?: SelectSubset<T, LandAgreementIndexFindFirstArgs<ExtArgs>>): Prisma__LandAgreementIndexClient<$Result.GetResult<Prisma.$LandAgreementIndexPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LandAgreementIndex that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandAgreementIndexFindFirstOrThrowArgs} args - Arguments to find a LandAgreementIndex
     * @example
     * // Get one LandAgreementIndex
     * const landAgreementIndex = await prisma.landAgreementIndex.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LandAgreementIndexFindFirstOrThrowArgs>(args?: SelectSubset<T, LandAgreementIndexFindFirstOrThrowArgs<ExtArgs>>): Prisma__LandAgreementIndexClient<$Result.GetResult<Prisma.$LandAgreementIndexPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LandAgreementIndices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandAgreementIndexFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LandAgreementIndices
     * const landAgreementIndices = await prisma.landAgreementIndex.findMany()
     * 
     * // Get first 10 LandAgreementIndices
     * const landAgreementIndices = await prisma.landAgreementIndex.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const landAgreementIndexWithIdOnly = await prisma.landAgreementIndex.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LandAgreementIndexFindManyArgs>(args?: SelectSubset<T, LandAgreementIndexFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LandAgreementIndexPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LandAgreementIndex.
     * @param {LandAgreementIndexCreateArgs} args - Arguments to create a LandAgreementIndex.
     * @example
     * // Create one LandAgreementIndex
     * const LandAgreementIndex = await prisma.landAgreementIndex.create({
     *   data: {
     *     // ... data to create a LandAgreementIndex
     *   }
     * })
     * 
     */
    create<T extends LandAgreementIndexCreateArgs>(args: SelectSubset<T, LandAgreementIndexCreateArgs<ExtArgs>>): Prisma__LandAgreementIndexClient<$Result.GetResult<Prisma.$LandAgreementIndexPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LandAgreementIndices.
     * @param {LandAgreementIndexCreateManyArgs} args - Arguments to create many LandAgreementIndices.
     * @example
     * // Create many LandAgreementIndices
     * const landAgreementIndex = await prisma.landAgreementIndex.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LandAgreementIndexCreateManyArgs>(args?: SelectSubset<T, LandAgreementIndexCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LandAgreementIndices and returns the data saved in the database.
     * @param {LandAgreementIndexCreateManyAndReturnArgs} args - Arguments to create many LandAgreementIndices.
     * @example
     * // Create many LandAgreementIndices
     * const landAgreementIndex = await prisma.landAgreementIndex.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LandAgreementIndices and only return the `id`
     * const landAgreementIndexWithIdOnly = await prisma.landAgreementIndex.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LandAgreementIndexCreateManyAndReturnArgs>(args?: SelectSubset<T, LandAgreementIndexCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LandAgreementIndexPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LandAgreementIndex.
     * @param {LandAgreementIndexDeleteArgs} args - Arguments to delete one LandAgreementIndex.
     * @example
     * // Delete one LandAgreementIndex
     * const LandAgreementIndex = await prisma.landAgreementIndex.delete({
     *   where: {
     *     // ... filter to delete one LandAgreementIndex
     *   }
     * })
     * 
     */
    delete<T extends LandAgreementIndexDeleteArgs>(args: SelectSubset<T, LandAgreementIndexDeleteArgs<ExtArgs>>): Prisma__LandAgreementIndexClient<$Result.GetResult<Prisma.$LandAgreementIndexPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LandAgreementIndex.
     * @param {LandAgreementIndexUpdateArgs} args - Arguments to update one LandAgreementIndex.
     * @example
     * // Update one LandAgreementIndex
     * const landAgreementIndex = await prisma.landAgreementIndex.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LandAgreementIndexUpdateArgs>(args: SelectSubset<T, LandAgreementIndexUpdateArgs<ExtArgs>>): Prisma__LandAgreementIndexClient<$Result.GetResult<Prisma.$LandAgreementIndexPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LandAgreementIndices.
     * @param {LandAgreementIndexDeleteManyArgs} args - Arguments to filter LandAgreementIndices to delete.
     * @example
     * // Delete a few LandAgreementIndices
     * const { count } = await prisma.landAgreementIndex.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LandAgreementIndexDeleteManyArgs>(args?: SelectSubset<T, LandAgreementIndexDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LandAgreementIndices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandAgreementIndexUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LandAgreementIndices
     * const landAgreementIndex = await prisma.landAgreementIndex.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LandAgreementIndexUpdateManyArgs>(args: SelectSubset<T, LandAgreementIndexUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LandAgreementIndices and returns the data updated in the database.
     * @param {LandAgreementIndexUpdateManyAndReturnArgs} args - Arguments to update many LandAgreementIndices.
     * @example
     * // Update many LandAgreementIndices
     * const landAgreementIndex = await prisma.landAgreementIndex.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LandAgreementIndices and only return the `id`
     * const landAgreementIndexWithIdOnly = await prisma.landAgreementIndex.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LandAgreementIndexUpdateManyAndReturnArgs>(args: SelectSubset<T, LandAgreementIndexUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LandAgreementIndexPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LandAgreementIndex.
     * @param {LandAgreementIndexUpsertArgs} args - Arguments to update or create a LandAgreementIndex.
     * @example
     * // Update or create a LandAgreementIndex
     * const landAgreementIndex = await prisma.landAgreementIndex.upsert({
     *   create: {
     *     // ... data to create a LandAgreementIndex
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LandAgreementIndex we want to update
     *   }
     * })
     */
    upsert<T extends LandAgreementIndexUpsertArgs>(args: SelectSubset<T, LandAgreementIndexUpsertArgs<ExtArgs>>): Prisma__LandAgreementIndexClient<$Result.GetResult<Prisma.$LandAgreementIndexPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LandAgreementIndices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandAgreementIndexCountArgs} args - Arguments to filter LandAgreementIndices to count.
     * @example
     * // Count the number of LandAgreementIndices
     * const count = await prisma.landAgreementIndex.count({
     *   where: {
     *     // ... the filter for the LandAgreementIndices we want to count
     *   }
     * })
    **/
    count<T extends LandAgreementIndexCountArgs>(
      args?: Subset<T, LandAgreementIndexCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LandAgreementIndexCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LandAgreementIndex.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandAgreementIndexAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LandAgreementIndexAggregateArgs>(args: Subset<T, LandAgreementIndexAggregateArgs>): Prisma.PrismaPromise<GetLandAgreementIndexAggregateType<T>>

    /**
     * Group by LandAgreementIndex.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandAgreementIndexGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LandAgreementIndexGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LandAgreementIndexGroupByArgs['orderBy'] }
        : { orderBy?: LandAgreementIndexGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LandAgreementIndexGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLandAgreementIndexGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LandAgreementIndex model
   */
  readonly fields: LandAgreementIndexFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LandAgreementIndex.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LandAgreementIndexClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LandAgreementIndex model
   */
  interface LandAgreementIndexFieldRefs {
    readonly id: FieldRef<"LandAgreementIndex", 'String'>
    readonly agreementId: FieldRef<"LandAgreementIndex", 'String'>
    readonly creatorUserId: FieldRef<"LandAgreementIndex", 'String'>
    readonly partnerUserId: FieldRef<"LandAgreementIndex", 'String'>
    readonly status: FieldRef<"LandAgreementIndex", 'String'>
    readonly createdAt: FieldRef<"LandAgreementIndex", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LandAgreementIndex findUnique
   */
  export type LandAgreementIndexFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
    /**
     * Filter, which LandAgreementIndex to fetch.
     */
    where: LandAgreementIndexWhereUniqueInput
  }

  /**
   * LandAgreementIndex findUniqueOrThrow
   */
  export type LandAgreementIndexFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
    /**
     * Filter, which LandAgreementIndex to fetch.
     */
    where: LandAgreementIndexWhereUniqueInput
  }

  /**
   * LandAgreementIndex findFirst
   */
  export type LandAgreementIndexFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
    /**
     * Filter, which LandAgreementIndex to fetch.
     */
    where?: LandAgreementIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandAgreementIndices to fetch.
     */
    orderBy?: LandAgreementIndexOrderByWithRelationInput | LandAgreementIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LandAgreementIndices.
     */
    cursor?: LandAgreementIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandAgreementIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandAgreementIndices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LandAgreementIndices.
     */
    distinct?: LandAgreementIndexScalarFieldEnum | LandAgreementIndexScalarFieldEnum[]
  }

  /**
   * LandAgreementIndex findFirstOrThrow
   */
  export type LandAgreementIndexFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
    /**
     * Filter, which LandAgreementIndex to fetch.
     */
    where?: LandAgreementIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandAgreementIndices to fetch.
     */
    orderBy?: LandAgreementIndexOrderByWithRelationInput | LandAgreementIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LandAgreementIndices.
     */
    cursor?: LandAgreementIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandAgreementIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandAgreementIndices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LandAgreementIndices.
     */
    distinct?: LandAgreementIndexScalarFieldEnum | LandAgreementIndexScalarFieldEnum[]
  }

  /**
   * LandAgreementIndex findMany
   */
  export type LandAgreementIndexFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
    /**
     * Filter, which LandAgreementIndices to fetch.
     */
    where?: LandAgreementIndexWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandAgreementIndices to fetch.
     */
    orderBy?: LandAgreementIndexOrderByWithRelationInput | LandAgreementIndexOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LandAgreementIndices.
     */
    cursor?: LandAgreementIndexWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandAgreementIndices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandAgreementIndices.
     */
    skip?: number
    distinct?: LandAgreementIndexScalarFieldEnum | LandAgreementIndexScalarFieldEnum[]
  }

  /**
   * LandAgreementIndex create
   */
  export type LandAgreementIndexCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
    /**
     * The data needed to create a LandAgreementIndex.
     */
    data: XOR<LandAgreementIndexCreateInput, LandAgreementIndexUncheckedCreateInput>
  }

  /**
   * LandAgreementIndex createMany
   */
  export type LandAgreementIndexCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LandAgreementIndices.
     */
    data: LandAgreementIndexCreateManyInput | LandAgreementIndexCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LandAgreementIndex createManyAndReturn
   */
  export type LandAgreementIndexCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
    /**
     * The data used to create many LandAgreementIndices.
     */
    data: LandAgreementIndexCreateManyInput | LandAgreementIndexCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LandAgreementIndex update
   */
  export type LandAgreementIndexUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
    /**
     * The data needed to update a LandAgreementIndex.
     */
    data: XOR<LandAgreementIndexUpdateInput, LandAgreementIndexUncheckedUpdateInput>
    /**
     * Choose, which LandAgreementIndex to update.
     */
    where: LandAgreementIndexWhereUniqueInput
  }

  /**
   * LandAgreementIndex updateMany
   */
  export type LandAgreementIndexUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LandAgreementIndices.
     */
    data: XOR<LandAgreementIndexUpdateManyMutationInput, LandAgreementIndexUncheckedUpdateManyInput>
    /**
     * Filter which LandAgreementIndices to update
     */
    where?: LandAgreementIndexWhereInput
    /**
     * Limit how many LandAgreementIndices to update.
     */
    limit?: number
  }

  /**
   * LandAgreementIndex updateManyAndReturn
   */
  export type LandAgreementIndexUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
    /**
     * The data used to update LandAgreementIndices.
     */
    data: XOR<LandAgreementIndexUpdateManyMutationInput, LandAgreementIndexUncheckedUpdateManyInput>
    /**
     * Filter which LandAgreementIndices to update
     */
    where?: LandAgreementIndexWhereInput
    /**
     * Limit how many LandAgreementIndices to update.
     */
    limit?: number
  }

  /**
   * LandAgreementIndex upsert
   */
  export type LandAgreementIndexUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
    /**
     * The filter to search for the LandAgreementIndex to update in case it exists.
     */
    where: LandAgreementIndexWhereUniqueInput
    /**
     * In case the LandAgreementIndex found by the `where` argument doesn't exist, create a new LandAgreementIndex with this data.
     */
    create: XOR<LandAgreementIndexCreateInput, LandAgreementIndexUncheckedCreateInput>
    /**
     * In case the LandAgreementIndex was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LandAgreementIndexUpdateInput, LandAgreementIndexUncheckedUpdateInput>
  }

  /**
   * LandAgreementIndex delete
   */
  export type LandAgreementIndexDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
    /**
     * Filter which LandAgreementIndex to delete.
     */
    where: LandAgreementIndexWhereUniqueInput
  }

  /**
   * LandAgreementIndex deleteMany
   */
  export type LandAgreementIndexDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LandAgreementIndices to delete
     */
    where?: LandAgreementIndexWhereInput
    /**
     * Limit how many LandAgreementIndices to delete.
     */
    limit?: number
  }

  /**
   * LandAgreementIndex without action
   */
  export type LandAgreementIndexDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandAgreementIndex
     */
    select?: LandAgreementIndexSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandAgreementIndex
     */
    omit?: LandAgreementIndexOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const FarmerProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    userMongoId: 'userMongoId',
    ethAddress: 'ethAddress',
    annualIncomeINR: 'annualIncomeINR',
    nameEnglish: 'nameEnglish',
    nameKannada: 'nameKannada',
    nameDisplay: 'nameDisplay',
    nameNormalized: 'nameNormalized',
    dob: 'dob',
    gender: 'gender',
    aadhaarAddress: 'aadhaarAddress',
    aadhaarVerified: 'aadhaarVerified',
    aadhaarDocCid: 'aadhaarDocCid',
    aadhaarCloudUrl: 'aadhaarCloudUrl',
    district: 'district',
    taluk: 'taluk',
    hobli: 'hobli',
    village: 'village',
    surveyNumber: 'surveyNumber',
    hissaNumber: 'hissaNumber',
    totalExtentRaw: 'totalExtentRaw',
    totalExtentAcres: 'totalExtentAcres',
    soilType: 'soilType',
    irrigationType: 'irrigationType',
    rtcOwnerName: 'rtcOwnerName',
    rtcVerified: 'rtcVerified',
    rtcDocCid: 'rtcDocCid',
    rtcCloudUrl: 'rtcCloudUrl',
    landSketchUrl: 'landSketchUrl',
    landBoundary: 'landBoundary',
    centerLat: 'centerLat',
    centerLng: 'centerLng',
    nameMatchConfidence: 'nameMatchConfidence',
    nameMatchStatus: 'nameMatchStatus',
    kycStatus: 'kycStatus',
    kycSubmittedAt: 'kycSubmittedAt',
    kycApprovedAt: 'kycApprovedAt',
    kycRejectedAt: 'kycRejectedAt',
    kycRejectionReason: 'kycRejectionReason',
    readyToIntegrate: 'readyToIntegrate',
    landOwnershipType: 'landOwnershipType',
    casteCategory: 'casteCategory',
    isIncomeTaxPayer: 'isIncomeTaxPayer',
    isGovtEmployee: 'isGovtEmployee',
    hasKCC: 'hasKCC',
    hasAadhaarLinkedBank: 'hasAadhaarLinkedBank',
    hasLivestock: 'hasLivestock',
    farmingType: 'farmingType',
    cropsGrown: 'cropsGrown',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FarmerProfileScalarFieldEnum = (typeof FarmerProfileScalarFieldEnum)[keyof typeof FarmerProfileScalarFieldEnum]


  export const LandAgreementIndexScalarFieldEnum: {
    id: 'id',
    agreementId: 'agreementId',
    creatorUserId: 'creatorUserId',
    partnerUserId: 'partnerUserId',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type LandAgreementIndexScalarFieldEnum = (typeof LandAgreementIndexScalarFieldEnum)[keyof typeof LandAgreementIndexScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type FarmerProfileWhereInput = {
    AND?: FarmerProfileWhereInput | FarmerProfileWhereInput[]
    OR?: FarmerProfileWhereInput[]
    NOT?: FarmerProfileWhereInput | FarmerProfileWhereInput[]
    id?: StringFilter<"FarmerProfile"> | string
    userId?: StringFilter<"FarmerProfile"> | string
    userMongoId?: StringNullableFilter<"FarmerProfile"> | string | null
    ethAddress?: StringNullableFilter<"FarmerProfile"> | string | null
    annualIncomeINR?: FloatNullableFilter<"FarmerProfile"> | number | null
    nameEnglish?: StringNullableFilter<"FarmerProfile"> | string | null
    nameKannada?: StringNullableFilter<"FarmerProfile"> | string | null
    nameDisplay?: StringNullableFilter<"FarmerProfile"> | string | null
    nameNormalized?: StringNullableFilter<"FarmerProfile"> | string | null
    dob?: StringNullableFilter<"FarmerProfile"> | string | null
    gender?: StringNullableFilter<"FarmerProfile"> | string | null
    aadhaarAddress?: StringNullableFilter<"FarmerProfile"> | string | null
    aadhaarVerified?: BoolFilter<"FarmerProfile"> | boolean
    aadhaarDocCid?: StringNullableFilter<"FarmerProfile"> | string | null
    aadhaarCloudUrl?: StringNullableFilter<"FarmerProfile"> | string | null
    district?: StringNullableFilter<"FarmerProfile"> | string | null
    taluk?: StringNullableFilter<"FarmerProfile"> | string | null
    hobli?: StringNullableFilter<"FarmerProfile"> | string | null
    village?: StringNullableFilter<"FarmerProfile"> | string | null
    surveyNumber?: StringNullableFilter<"FarmerProfile"> | string | null
    hissaNumber?: StringNullableFilter<"FarmerProfile"> | string | null
    totalExtentRaw?: StringNullableFilter<"FarmerProfile"> | string | null
    totalExtentAcres?: FloatNullableFilter<"FarmerProfile"> | number | null
    soilType?: StringNullableFilter<"FarmerProfile"> | string | null
    irrigationType?: StringNullableFilter<"FarmerProfile"> | string | null
    rtcOwnerName?: StringNullableFilter<"FarmerProfile"> | string | null
    rtcVerified?: BoolFilter<"FarmerProfile"> | boolean
    rtcDocCid?: StringNullableFilter<"FarmerProfile"> | string | null
    rtcCloudUrl?: StringNullableFilter<"FarmerProfile"> | string | null
    landSketchUrl?: StringNullableFilter<"FarmerProfile"> | string | null
    landBoundary?: JsonNullableFilter<"FarmerProfile">
    centerLat?: FloatNullableFilter<"FarmerProfile"> | number | null
    centerLng?: FloatNullableFilter<"FarmerProfile"> | number | null
    nameMatchConfidence?: FloatNullableFilter<"FarmerProfile"> | number | null
    nameMatchStatus?: StringFilter<"FarmerProfile"> | string
    kycStatus?: StringFilter<"FarmerProfile"> | string
    kycSubmittedAt?: DateTimeNullableFilter<"FarmerProfile"> | Date | string | null
    kycApprovedAt?: DateTimeNullableFilter<"FarmerProfile"> | Date | string | null
    kycRejectedAt?: DateTimeNullableFilter<"FarmerProfile"> | Date | string | null
    kycRejectionReason?: StringNullableFilter<"FarmerProfile"> | string | null
    readyToIntegrate?: BoolFilter<"FarmerProfile"> | boolean
    landOwnershipType?: StringNullableFilter<"FarmerProfile"> | string | null
    casteCategory?: StringNullableFilter<"FarmerProfile"> | string | null
    isIncomeTaxPayer?: BoolFilter<"FarmerProfile"> | boolean
    isGovtEmployee?: BoolFilter<"FarmerProfile"> | boolean
    hasKCC?: BoolFilter<"FarmerProfile"> | boolean
    hasAadhaarLinkedBank?: BoolFilter<"FarmerProfile"> | boolean
    hasLivestock?: BoolFilter<"FarmerProfile"> | boolean
    farmingType?: StringFilter<"FarmerProfile"> | string
    cropsGrown?: StringNullableListFilter<"FarmerProfile">
    createdAt?: DateTimeFilter<"FarmerProfile"> | Date | string
    updatedAt?: DateTimeFilter<"FarmerProfile"> | Date | string
  }

  export type FarmerProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    userMongoId?: SortOrderInput | SortOrder
    ethAddress?: SortOrderInput | SortOrder
    annualIncomeINR?: SortOrderInput | SortOrder
    nameEnglish?: SortOrderInput | SortOrder
    nameKannada?: SortOrderInput | SortOrder
    nameDisplay?: SortOrderInput | SortOrder
    nameNormalized?: SortOrderInput | SortOrder
    dob?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    aadhaarAddress?: SortOrderInput | SortOrder
    aadhaarVerified?: SortOrder
    aadhaarDocCid?: SortOrderInput | SortOrder
    aadhaarCloudUrl?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    taluk?: SortOrderInput | SortOrder
    hobli?: SortOrderInput | SortOrder
    village?: SortOrderInput | SortOrder
    surveyNumber?: SortOrderInput | SortOrder
    hissaNumber?: SortOrderInput | SortOrder
    totalExtentRaw?: SortOrderInput | SortOrder
    totalExtentAcres?: SortOrderInput | SortOrder
    soilType?: SortOrderInput | SortOrder
    irrigationType?: SortOrderInput | SortOrder
    rtcOwnerName?: SortOrderInput | SortOrder
    rtcVerified?: SortOrder
    rtcDocCid?: SortOrderInput | SortOrder
    rtcCloudUrl?: SortOrderInput | SortOrder
    landSketchUrl?: SortOrderInput | SortOrder
    landBoundary?: SortOrderInput | SortOrder
    centerLat?: SortOrderInput | SortOrder
    centerLng?: SortOrderInput | SortOrder
    nameMatchConfidence?: SortOrderInput | SortOrder
    nameMatchStatus?: SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrderInput | SortOrder
    kycApprovedAt?: SortOrderInput | SortOrder
    kycRejectedAt?: SortOrderInput | SortOrder
    kycRejectionReason?: SortOrderInput | SortOrder
    readyToIntegrate?: SortOrder
    landOwnershipType?: SortOrderInput | SortOrder
    casteCategory?: SortOrderInput | SortOrder
    isIncomeTaxPayer?: SortOrder
    isGovtEmployee?: SortOrder
    hasKCC?: SortOrder
    hasAadhaarLinkedBank?: SortOrder
    hasLivestock?: SortOrder
    farmingType?: SortOrder
    cropsGrown?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FarmerProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: FarmerProfileWhereInput | FarmerProfileWhereInput[]
    OR?: FarmerProfileWhereInput[]
    NOT?: FarmerProfileWhereInput | FarmerProfileWhereInput[]
    userMongoId?: StringNullableFilter<"FarmerProfile"> | string | null
    ethAddress?: StringNullableFilter<"FarmerProfile"> | string | null
    annualIncomeINR?: FloatNullableFilter<"FarmerProfile"> | number | null
    nameEnglish?: StringNullableFilter<"FarmerProfile"> | string | null
    nameKannada?: StringNullableFilter<"FarmerProfile"> | string | null
    nameDisplay?: StringNullableFilter<"FarmerProfile"> | string | null
    nameNormalized?: StringNullableFilter<"FarmerProfile"> | string | null
    dob?: StringNullableFilter<"FarmerProfile"> | string | null
    gender?: StringNullableFilter<"FarmerProfile"> | string | null
    aadhaarAddress?: StringNullableFilter<"FarmerProfile"> | string | null
    aadhaarVerified?: BoolFilter<"FarmerProfile"> | boolean
    aadhaarDocCid?: StringNullableFilter<"FarmerProfile"> | string | null
    aadhaarCloudUrl?: StringNullableFilter<"FarmerProfile"> | string | null
    district?: StringNullableFilter<"FarmerProfile"> | string | null
    taluk?: StringNullableFilter<"FarmerProfile"> | string | null
    hobli?: StringNullableFilter<"FarmerProfile"> | string | null
    village?: StringNullableFilter<"FarmerProfile"> | string | null
    surveyNumber?: StringNullableFilter<"FarmerProfile"> | string | null
    hissaNumber?: StringNullableFilter<"FarmerProfile"> | string | null
    totalExtentRaw?: StringNullableFilter<"FarmerProfile"> | string | null
    totalExtentAcres?: FloatNullableFilter<"FarmerProfile"> | number | null
    soilType?: StringNullableFilter<"FarmerProfile"> | string | null
    irrigationType?: StringNullableFilter<"FarmerProfile"> | string | null
    rtcOwnerName?: StringNullableFilter<"FarmerProfile"> | string | null
    rtcVerified?: BoolFilter<"FarmerProfile"> | boolean
    rtcDocCid?: StringNullableFilter<"FarmerProfile"> | string | null
    rtcCloudUrl?: StringNullableFilter<"FarmerProfile"> | string | null
    landSketchUrl?: StringNullableFilter<"FarmerProfile"> | string | null
    landBoundary?: JsonNullableFilter<"FarmerProfile">
    centerLat?: FloatNullableFilter<"FarmerProfile"> | number | null
    centerLng?: FloatNullableFilter<"FarmerProfile"> | number | null
    nameMatchConfidence?: FloatNullableFilter<"FarmerProfile"> | number | null
    nameMatchStatus?: StringFilter<"FarmerProfile"> | string
    kycStatus?: StringFilter<"FarmerProfile"> | string
    kycSubmittedAt?: DateTimeNullableFilter<"FarmerProfile"> | Date | string | null
    kycApprovedAt?: DateTimeNullableFilter<"FarmerProfile"> | Date | string | null
    kycRejectedAt?: DateTimeNullableFilter<"FarmerProfile"> | Date | string | null
    kycRejectionReason?: StringNullableFilter<"FarmerProfile"> | string | null
    readyToIntegrate?: BoolFilter<"FarmerProfile"> | boolean
    landOwnershipType?: StringNullableFilter<"FarmerProfile"> | string | null
    casteCategory?: StringNullableFilter<"FarmerProfile"> | string | null
    isIncomeTaxPayer?: BoolFilter<"FarmerProfile"> | boolean
    isGovtEmployee?: BoolFilter<"FarmerProfile"> | boolean
    hasKCC?: BoolFilter<"FarmerProfile"> | boolean
    hasAadhaarLinkedBank?: BoolFilter<"FarmerProfile"> | boolean
    hasLivestock?: BoolFilter<"FarmerProfile"> | boolean
    farmingType?: StringFilter<"FarmerProfile"> | string
    cropsGrown?: StringNullableListFilter<"FarmerProfile">
    createdAt?: DateTimeFilter<"FarmerProfile"> | Date | string
    updatedAt?: DateTimeFilter<"FarmerProfile"> | Date | string
  }, "id" | "userId">

  export type FarmerProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    userMongoId?: SortOrderInput | SortOrder
    ethAddress?: SortOrderInput | SortOrder
    annualIncomeINR?: SortOrderInput | SortOrder
    nameEnglish?: SortOrderInput | SortOrder
    nameKannada?: SortOrderInput | SortOrder
    nameDisplay?: SortOrderInput | SortOrder
    nameNormalized?: SortOrderInput | SortOrder
    dob?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    aadhaarAddress?: SortOrderInput | SortOrder
    aadhaarVerified?: SortOrder
    aadhaarDocCid?: SortOrderInput | SortOrder
    aadhaarCloudUrl?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    taluk?: SortOrderInput | SortOrder
    hobli?: SortOrderInput | SortOrder
    village?: SortOrderInput | SortOrder
    surveyNumber?: SortOrderInput | SortOrder
    hissaNumber?: SortOrderInput | SortOrder
    totalExtentRaw?: SortOrderInput | SortOrder
    totalExtentAcres?: SortOrderInput | SortOrder
    soilType?: SortOrderInput | SortOrder
    irrigationType?: SortOrderInput | SortOrder
    rtcOwnerName?: SortOrderInput | SortOrder
    rtcVerified?: SortOrder
    rtcDocCid?: SortOrderInput | SortOrder
    rtcCloudUrl?: SortOrderInput | SortOrder
    landSketchUrl?: SortOrderInput | SortOrder
    landBoundary?: SortOrderInput | SortOrder
    centerLat?: SortOrderInput | SortOrder
    centerLng?: SortOrderInput | SortOrder
    nameMatchConfidence?: SortOrderInput | SortOrder
    nameMatchStatus?: SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrderInput | SortOrder
    kycApprovedAt?: SortOrderInput | SortOrder
    kycRejectedAt?: SortOrderInput | SortOrder
    kycRejectionReason?: SortOrderInput | SortOrder
    readyToIntegrate?: SortOrder
    landOwnershipType?: SortOrderInput | SortOrder
    casteCategory?: SortOrderInput | SortOrder
    isIncomeTaxPayer?: SortOrder
    isGovtEmployee?: SortOrder
    hasKCC?: SortOrder
    hasAadhaarLinkedBank?: SortOrder
    hasLivestock?: SortOrder
    farmingType?: SortOrder
    cropsGrown?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FarmerProfileCountOrderByAggregateInput
    _avg?: FarmerProfileAvgOrderByAggregateInput
    _max?: FarmerProfileMaxOrderByAggregateInput
    _min?: FarmerProfileMinOrderByAggregateInput
    _sum?: FarmerProfileSumOrderByAggregateInput
  }

  export type FarmerProfileScalarWhereWithAggregatesInput = {
    AND?: FarmerProfileScalarWhereWithAggregatesInput | FarmerProfileScalarWhereWithAggregatesInput[]
    OR?: FarmerProfileScalarWhereWithAggregatesInput[]
    NOT?: FarmerProfileScalarWhereWithAggregatesInput | FarmerProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FarmerProfile"> | string
    userId?: StringWithAggregatesFilter<"FarmerProfile"> | string
    userMongoId?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    ethAddress?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    annualIncomeINR?: FloatNullableWithAggregatesFilter<"FarmerProfile"> | number | null
    nameEnglish?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    nameKannada?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    nameDisplay?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    nameNormalized?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    dob?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    gender?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    aadhaarAddress?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    aadhaarVerified?: BoolWithAggregatesFilter<"FarmerProfile"> | boolean
    aadhaarDocCid?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    aadhaarCloudUrl?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    district?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    taluk?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    hobli?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    village?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    surveyNumber?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    hissaNumber?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    totalExtentRaw?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    totalExtentAcres?: FloatNullableWithAggregatesFilter<"FarmerProfile"> | number | null
    soilType?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    irrigationType?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    rtcOwnerName?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    rtcVerified?: BoolWithAggregatesFilter<"FarmerProfile"> | boolean
    rtcDocCid?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    rtcCloudUrl?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    landSketchUrl?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    landBoundary?: JsonNullableWithAggregatesFilter<"FarmerProfile">
    centerLat?: FloatNullableWithAggregatesFilter<"FarmerProfile"> | number | null
    centerLng?: FloatNullableWithAggregatesFilter<"FarmerProfile"> | number | null
    nameMatchConfidence?: FloatNullableWithAggregatesFilter<"FarmerProfile"> | number | null
    nameMatchStatus?: StringWithAggregatesFilter<"FarmerProfile"> | string
    kycStatus?: StringWithAggregatesFilter<"FarmerProfile"> | string
    kycSubmittedAt?: DateTimeNullableWithAggregatesFilter<"FarmerProfile"> | Date | string | null
    kycApprovedAt?: DateTimeNullableWithAggregatesFilter<"FarmerProfile"> | Date | string | null
    kycRejectedAt?: DateTimeNullableWithAggregatesFilter<"FarmerProfile"> | Date | string | null
    kycRejectionReason?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    readyToIntegrate?: BoolWithAggregatesFilter<"FarmerProfile"> | boolean
    landOwnershipType?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    casteCategory?: StringNullableWithAggregatesFilter<"FarmerProfile"> | string | null
    isIncomeTaxPayer?: BoolWithAggregatesFilter<"FarmerProfile"> | boolean
    isGovtEmployee?: BoolWithAggregatesFilter<"FarmerProfile"> | boolean
    hasKCC?: BoolWithAggregatesFilter<"FarmerProfile"> | boolean
    hasAadhaarLinkedBank?: BoolWithAggregatesFilter<"FarmerProfile"> | boolean
    hasLivestock?: BoolWithAggregatesFilter<"FarmerProfile"> | boolean
    farmingType?: StringWithAggregatesFilter<"FarmerProfile"> | string
    cropsGrown?: StringNullableListFilter<"FarmerProfile">
    createdAt?: DateTimeWithAggregatesFilter<"FarmerProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FarmerProfile"> | Date | string
  }

  export type LandAgreementIndexWhereInput = {
    AND?: LandAgreementIndexWhereInput | LandAgreementIndexWhereInput[]
    OR?: LandAgreementIndexWhereInput[]
    NOT?: LandAgreementIndexWhereInput | LandAgreementIndexWhereInput[]
    id?: StringFilter<"LandAgreementIndex"> | string
    agreementId?: StringFilter<"LandAgreementIndex"> | string
    creatorUserId?: StringFilter<"LandAgreementIndex"> | string
    partnerUserId?: StringFilter<"LandAgreementIndex"> | string
    status?: StringFilter<"LandAgreementIndex"> | string
    createdAt?: DateTimeFilter<"LandAgreementIndex"> | Date | string
  }

  export type LandAgreementIndexOrderByWithRelationInput = {
    id?: SortOrder
    agreementId?: SortOrder
    creatorUserId?: SortOrder
    partnerUserId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type LandAgreementIndexWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    agreementId?: string
    AND?: LandAgreementIndexWhereInput | LandAgreementIndexWhereInput[]
    OR?: LandAgreementIndexWhereInput[]
    NOT?: LandAgreementIndexWhereInput | LandAgreementIndexWhereInput[]
    creatorUserId?: StringFilter<"LandAgreementIndex"> | string
    partnerUserId?: StringFilter<"LandAgreementIndex"> | string
    status?: StringFilter<"LandAgreementIndex"> | string
    createdAt?: DateTimeFilter<"LandAgreementIndex"> | Date | string
  }, "id" | "agreementId">

  export type LandAgreementIndexOrderByWithAggregationInput = {
    id?: SortOrder
    agreementId?: SortOrder
    creatorUserId?: SortOrder
    partnerUserId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: LandAgreementIndexCountOrderByAggregateInput
    _max?: LandAgreementIndexMaxOrderByAggregateInput
    _min?: LandAgreementIndexMinOrderByAggregateInput
  }

  export type LandAgreementIndexScalarWhereWithAggregatesInput = {
    AND?: LandAgreementIndexScalarWhereWithAggregatesInput | LandAgreementIndexScalarWhereWithAggregatesInput[]
    OR?: LandAgreementIndexScalarWhereWithAggregatesInput[]
    NOT?: LandAgreementIndexScalarWhereWithAggregatesInput | LandAgreementIndexScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LandAgreementIndex"> | string
    agreementId?: StringWithAggregatesFilter<"LandAgreementIndex"> | string
    creatorUserId?: StringWithAggregatesFilter<"LandAgreementIndex"> | string
    partnerUserId?: StringWithAggregatesFilter<"LandAgreementIndex"> | string
    status?: StringWithAggregatesFilter<"LandAgreementIndex"> | string
    createdAt?: DateTimeWithAggregatesFilter<"LandAgreementIndex"> | Date | string
  }

  export type FarmerProfileCreateInput = {
    id?: string
    userId: string
    userMongoId?: string | null
    ethAddress?: string | null
    annualIncomeINR?: number | null
    nameEnglish?: string | null
    nameKannada?: string | null
    nameDisplay?: string | null
    nameNormalized?: string | null
    dob?: string | null
    gender?: string | null
    aadhaarAddress?: string | null
    aadhaarVerified?: boolean
    aadhaarDocCid?: string | null
    aadhaarCloudUrl?: string | null
    district?: string | null
    taluk?: string | null
    hobli?: string | null
    village?: string | null
    surveyNumber?: string | null
    hissaNumber?: string | null
    totalExtentRaw?: string | null
    totalExtentAcres?: number | null
    soilType?: string | null
    irrigationType?: string | null
    rtcOwnerName?: string | null
    rtcVerified?: boolean
    rtcDocCid?: string | null
    rtcCloudUrl?: string | null
    landSketchUrl?: string | null
    landBoundary?: NullableJsonNullValueInput | InputJsonValue
    centerLat?: number | null
    centerLng?: number | null
    nameMatchConfidence?: number | null
    nameMatchStatus?: string
    kycStatus?: string
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    kycRejectedAt?: Date | string | null
    kycRejectionReason?: string | null
    readyToIntegrate?: boolean
    landOwnershipType?: string | null
    casteCategory?: string | null
    isIncomeTaxPayer?: boolean
    isGovtEmployee?: boolean
    hasKCC?: boolean
    hasAadhaarLinkedBank?: boolean
    hasLivestock?: boolean
    farmingType?: string
    cropsGrown?: FarmerProfileCreatecropsGrownInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FarmerProfileUncheckedCreateInput = {
    id?: string
    userId: string
    userMongoId?: string | null
    ethAddress?: string | null
    annualIncomeINR?: number | null
    nameEnglish?: string | null
    nameKannada?: string | null
    nameDisplay?: string | null
    nameNormalized?: string | null
    dob?: string | null
    gender?: string | null
    aadhaarAddress?: string | null
    aadhaarVerified?: boolean
    aadhaarDocCid?: string | null
    aadhaarCloudUrl?: string | null
    district?: string | null
    taluk?: string | null
    hobli?: string | null
    village?: string | null
    surveyNumber?: string | null
    hissaNumber?: string | null
    totalExtentRaw?: string | null
    totalExtentAcres?: number | null
    soilType?: string | null
    irrigationType?: string | null
    rtcOwnerName?: string | null
    rtcVerified?: boolean
    rtcDocCid?: string | null
    rtcCloudUrl?: string | null
    landSketchUrl?: string | null
    landBoundary?: NullableJsonNullValueInput | InputJsonValue
    centerLat?: number | null
    centerLng?: number | null
    nameMatchConfidence?: number | null
    nameMatchStatus?: string
    kycStatus?: string
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    kycRejectedAt?: Date | string | null
    kycRejectionReason?: string | null
    readyToIntegrate?: boolean
    landOwnershipType?: string | null
    casteCategory?: string | null
    isIncomeTaxPayer?: boolean
    isGovtEmployee?: boolean
    hasKCC?: boolean
    hasAadhaarLinkedBank?: boolean
    hasLivestock?: boolean
    farmingType?: string
    cropsGrown?: FarmerProfileCreatecropsGrownInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FarmerProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userMongoId?: NullableStringFieldUpdateOperationsInput | string | null
    ethAddress?: NullableStringFieldUpdateOperationsInput | string | null
    annualIncomeINR?: NullableFloatFieldUpdateOperationsInput | number | null
    nameEnglish?: NullableStringFieldUpdateOperationsInput | string | null
    nameKannada?: NullableStringFieldUpdateOperationsInput | string | null
    nameDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    nameNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    dob?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarAddress?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarVerified?: BoolFieldUpdateOperationsInput | boolean
    aadhaarDocCid?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarCloudUrl?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    taluk?: NullableStringFieldUpdateOperationsInput | string | null
    hobli?: NullableStringFieldUpdateOperationsInput | string | null
    village?: NullableStringFieldUpdateOperationsInput | string | null
    surveyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    hissaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalExtentRaw?: NullableStringFieldUpdateOperationsInput | string | null
    totalExtentAcres?: NullableFloatFieldUpdateOperationsInput | number | null
    soilType?: NullableStringFieldUpdateOperationsInput | string | null
    irrigationType?: NullableStringFieldUpdateOperationsInput | string | null
    rtcOwnerName?: NullableStringFieldUpdateOperationsInput | string | null
    rtcVerified?: BoolFieldUpdateOperationsInput | boolean
    rtcDocCid?: NullableStringFieldUpdateOperationsInput | string | null
    rtcCloudUrl?: NullableStringFieldUpdateOperationsInput | string | null
    landSketchUrl?: NullableStringFieldUpdateOperationsInput | string | null
    landBoundary?: NullableJsonNullValueInput | InputJsonValue
    centerLat?: NullableFloatFieldUpdateOperationsInput | number | null
    centerLng?: NullableFloatFieldUpdateOperationsInput | number | null
    nameMatchConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    nameMatchStatus?: StringFieldUpdateOperationsInput | string
    kycStatus?: StringFieldUpdateOperationsInput | string
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycRejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    readyToIntegrate?: BoolFieldUpdateOperationsInput | boolean
    landOwnershipType?: NullableStringFieldUpdateOperationsInput | string | null
    casteCategory?: NullableStringFieldUpdateOperationsInput | string | null
    isIncomeTaxPayer?: BoolFieldUpdateOperationsInput | boolean
    isGovtEmployee?: BoolFieldUpdateOperationsInput | boolean
    hasKCC?: BoolFieldUpdateOperationsInput | boolean
    hasAadhaarLinkedBank?: BoolFieldUpdateOperationsInput | boolean
    hasLivestock?: BoolFieldUpdateOperationsInput | boolean
    farmingType?: StringFieldUpdateOperationsInput | string
    cropsGrown?: FarmerProfileUpdatecropsGrownInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmerProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userMongoId?: NullableStringFieldUpdateOperationsInput | string | null
    ethAddress?: NullableStringFieldUpdateOperationsInput | string | null
    annualIncomeINR?: NullableFloatFieldUpdateOperationsInput | number | null
    nameEnglish?: NullableStringFieldUpdateOperationsInput | string | null
    nameKannada?: NullableStringFieldUpdateOperationsInput | string | null
    nameDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    nameNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    dob?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarAddress?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarVerified?: BoolFieldUpdateOperationsInput | boolean
    aadhaarDocCid?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarCloudUrl?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    taluk?: NullableStringFieldUpdateOperationsInput | string | null
    hobli?: NullableStringFieldUpdateOperationsInput | string | null
    village?: NullableStringFieldUpdateOperationsInput | string | null
    surveyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    hissaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalExtentRaw?: NullableStringFieldUpdateOperationsInput | string | null
    totalExtentAcres?: NullableFloatFieldUpdateOperationsInput | number | null
    soilType?: NullableStringFieldUpdateOperationsInput | string | null
    irrigationType?: NullableStringFieldUpdateOperationsInput | string | null
    rtcOwnerName?: NullableStringFieldUpdateOperationsInput | string | null
    rtcVerified?: BoolFieldUpdateOperationsInput | boolean
    rtcDocCid?: NullableStringFieldUpdateOperationsInput | string | null
    rtcCloudUrl?: NullableStringFieldUpdateOperationsInput | string | null
    landSketchUrl?: NullableStringFieldUpdateOperationsInput | string | null
    landBoundary?: NullableJsonNullValueInput | InputJsonValue
    centerLat?: NullableFloatFieldUpdateOperationsInput | number | null
    centerLng?: NullableFloatFieldUpdateOperationsInput | number | null
    nameMatchConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    nameMatchStatus?: StringFieldUpdateOperationsInput | string
    kycStatus?: StringFieldUpdateOperationsInput | string
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycRejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    readyToIntegrate?: BoolFieldUpdateOperationsInput | boolean
    landOwnershipType?: NullableStringFieldUpdateOperationsInput | string | null
    casteCategory?: NullableStringFieldUpdateOperationsInput | string | null
    isIncomeTaxPayer?: BoolFieldUpdateOperationsInput | boolean
    isGovtEmployee?: BoolFieldUpdateOperationsInput | boolean
    hasKCC?: BoolFieldUpdateOperationsInput | boolean
    hasAadhaarLinkedBank?: BoolFieldUpdateOperationsInput | boolean
    hasLivestock?: BoolFieldUpdateOperationsInput | boolean
    farmingType?: StringFieldUpdateOperationsInput | string
    cropsGrown?: FarmerProfileUpdatecropsGrownInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmerProfileCreateManyInput = {
    id?: string
    userId: string
    userMongoId?: string | null
    ethAddress?: string | null
    annualIncomeINR?: number | null
    nameEnglish?: string | null
    nameKannada?: string | null
    nameDisplay?: string | null
    nameNormalized?: string | null
    dob?: string | null
    gender?: string | null
    aadhaarAddress?: string | null
    aadhaarVerified?: boolean
    aadhaarDocCid?: string | null
    aadhaarCloudUrl?: string | null
    district?: string | null
    taluk?: string | null
    hobli?: string | null
    village?: string | null
    surveyNumber?: string | null
    hissaNumber?: string | null
    totalExtentRaw?: string | null
    totalExtentAcres?: number | null
    soilType?: string | null
    irrigationType?: string | null
    rtcOwnerName?: string | null
    rtcVerified?: boolean
    rtcDocCid?: string | null
    rtcCloudUrl?: string | null
    landSketchUrl?: string | null
    landBoundary?: NullableJsonNullValueInput | InputJsonValue
    centerLat?: number | null
    centerLng?: number | null
    nameMatchConfidence?: number | null
    nameMatchStatus?: string
    kycStatus?: string
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    kycRejectedAt?: Date | string | null
    kycRejectionReason?: string | null
    readyToIntegrate?: boolean
    landOwnershipType?: string | null
    casteCategory?: string | null
    isIncomeTaxPayer?: boolean
    isGovtEmployee?: boolean
    hasKCC?: boolean
    hasAadhaarLinkedBank?: boolean
    hasLivestock?: boolean
    farmingType?: string
    cropsGrown?: FarmerProfileCreatecropsGrownInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FarmerProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userMongoId?: NullableStringFieldUpdateOperationsInput | string | null
    ethAddress?: NullableStringFieldUpdateOperationsInput | string | null
    annualIncomeINR?: NullableFloatFieldUpdateOperationsInput | number | null
    nameEnglish?: NullableStringFieldUpdateOperationsInput | string | null
    nameKannada?: NullableStringFieldUpdateOperationsInput | string | null
    nameDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    nameNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    dob?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarAddress?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarVerified?: BoolFieldUpdateOperationsInput | boolean
    aadhaarDocCid?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarCloudUrl?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    taluk?: NullableStringFieldUpdateOperationsInput | string | null
    hobli?: NullableStringFieldUpdateOperationsInput | string | null
    village?: NullableStringFieldUpdateOperationsInput | string | null
    surveyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    hissaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalExtentRaw?: NullableStringFieldUpdateOperationsInput | string | null
    totalExtentAcres?: NullableFloatFieldUpdateOperationsInput | number | null
    soilType?: NullableStringFieldUpdateOperationsInput | string | null
    irrigationType?: NullableStringFieldUpdateOperationsInput | string | null
    rtcOwnerName?: NullableStringFieldUpdateOperationsInput | string | null
    rtcVerified?: BoolFieldUpdateOperationsInput | boolean
    rtcDocCid?: NullableStringFieldUpdateOperationsInput | string | null
    rtcCloudUrl?: NullableStringFieldUpdateOperationsInput | string | null
    landSketchUrl?: NullableStringFieldUpdateOperationsInput | string | null
    landBoundary?: NullableJsonNullValueInput | InputJsonValue
    centerLat?: NullableFloatFieldUpdateOperationsInput | number | null
    centerLng?: NullableFloatFieldUpdateOperationsInput | number | null
    nameMatchConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    nameMatchStatus?: StringFieldUpdateOperationsInput | string
    kycStatus?: StringFieldUpdateOperationsInput | string
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycRejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    readyToIntegrate?: BoolFieldUpdateOperationsInput | boolean
    landOwnershipType?: NullableStringFieldUpdateOperationsInput | string | null
    casteCategory?: NullableStringFieldUpdateOperationsInput | string | null
    isIncomeTaxPayer?: BoolFieldUpdateOperationsInput | boolean
    isGovtEmployee?: BoolFieldUpdateOperationsInput | boolean
    hasKCC?: BoolFieldUpdateOperationsInput | boolean
    hasAadhaarLinkedBank?: BoolFieldUpdateOperationsInput | boolean
    hasLivestock?: BoolFieldUpdateOperationsInput | boolean
    farmingType?: StringFieldUpdateOperationsInput | string
    cropsGrown?: FarmerProfileUpdatecropsGrownInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FarmerProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userMongoId?: NullableStringFieldUpdateOperationsInput | string | null
    ethAddress?: NullableStringFieldUpdateOperationsInput | string | null
    annualIncomeINR?: NullableFloatFieldUpdateOperationsInput | number | null
    nameEnglish?: NullableStringFieldUpdateOperationsInput | string | null
    nameKannada?: NullableStringFieldUpdateOperationsInput | string | null
    nameDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    nameNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    dob?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarAddress?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarVerified?: BoolFieldUpdateOperationsInput | boolean
    aadhaarDocCid?: NullableStringFieldUpdateOperationsInput | string | null
    aadhaarCloudUrl?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    taluk?: NullableStringFieldUpdateOperationsInput | string | null
    hobli?: NullableStringFieldUpdateOperationsInput | string | null
    village?: NullableStringFieldUpdateOperationsInput | string | null
    surveyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    hissaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalExtentRaw?: NullableStringFieldUpdateOperationsInput | string | null
    totalExtentAcres?: NullableFloatFieldUpdateOperationsInput | number | null
    soilType?: NullableStringFieldUpdateOperationsInput | string | null
    irrigationType?: NullableStringFieldUpdateOperationsInput | string | null
    rtcOwnerName?: NullableStringFieldUpdateOperationsInput | string | null
    rtcVerified?: BoolFieldUpdateOperationsInput | boolean
    rtcDocCid?: NullableStringFieldUpdateOperationsInput | string | null
    rtcCloudUrl?: NullableStringFieldUpdateOperationsInput | string | null
    landSketchUrl?: NullableStringFieldUpdateOperationsInput | string | null
    landBoundary?: NullableJsonNullValueInput | InputJsonValue
    centerLat?: NullableFloatFieldUpdateOperationsInput | number | null
    centerLng?: NullableFloatFieldUpdateOperationsInput | number | null
    nameMatchConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    nameMatchStatus?: StringFieldUpdateOperationsInput | string
    kycStatus?: StringFieldUpdateOperationsInput | string
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycRejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    readyToIntegrate?: BoolFieldUpdateOperationsInput | boolean
    landOwnershipType?: NullableStringFieldUpdateOperationsInput | string | null
    casteCategory?: NullableStringFieldUpdateOperationsInput | string | null
    isIncomeTaxPayer?: BoolFieldUpdateOperationsInput | boolean
    isGovtEmployee?: BoolFieldUpdateOperationsInput | boolean
    hasKCC?: BoolFieldUpdateOperationsInput | boolean
    hasAadhaarLinkedBank?: BoolFieldUpdateOperationsInput | boolean
    hasLivestock?: BoolFieldUpdateOperationsInput | boolean
    farmingType?: StringFieldUpdateOperationsInput | string
    cropsGrown?: FarmerProfileUpdatecropsGrownInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandAgreementIndexCreateInput = {
    id?: string
    agreementId: string
    creatorUserId: string
    partnerUserId: string
    status?: string
    createdAt?: Date | string
  }

  export type LandAgreementIndexUncheckedCreateInput = {
    id?: string
    agreementId: string
    creatorUserId: string
    partnerUserId: string
    status?: string
    createdAt?: Date | string
  }

  export type LandAgreementIndexUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agreementId?: StringFieldUpdateOperationsInput | string
    creatorUserId?: StringFieldUpdateOperationsInput | string
    partnerUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandAgreementIndexUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agreementId?: StringFieldUpdateOperationsInput | string
    creatorUserId?: StringFieldUpdateOperationsInput | string
    partnerUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandAgreementIndexCreateManyInput = {
    id?: string
    agreementId: string
    creatorUserId: string
    partnerUserId: string
    status?: string
    createdAt?: Date | string
  }

  export type LandAgreementIndexUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    agreementId?: StringFieldUpdateOperationsInput | string
    creatorUserId?: StringFieldUpdateOperationsInput | string
    partnerUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandAgreementIndexUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agreementId?: StringFieldUpdateOperationsInput | string
    creatorUserId?: StringFieldUpdateOperationsInput | string
    partnerUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FarmerProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userMongoId?: SortOrder
    ethAddress?: SortOrder
    annualIncomeINR?: SortOrder
    nameEnglish?: SortOrder
    nameKannada?: SortOrder
    nameDisplay?: SortOrder
    nameNormalized?: SortOrder
    dob?: SortOrder
    gender?: SortOrder
    aadhaarAddress?: SortOrder
    aadhaarVerified?: SortOrder
    aadhaarDocCid?: SortOrder
    aadhaarCloudUrl?: SortOrder
    district?: SortOrder
    taluk?: SortOrder
    hobli?: SortOrder
    village?: SortOrder
    surveyNumber?: SortOrder
    hissaNumber?: SortOrder
    totalExtentRaw?: SortOrder
    totalExtentAcres?: SortOrder
    soilType?: SortOrder
    irrigationType?: SortOrder
    rtcOwnerName?: SortOrder
    rtcVerified?: SortOrder
    rtcDocCid?: SortOrder
    rtcCloudUrl?: SortOrder
    landSketchUrl?: SortOrder
    landBoundary?: SortOrder
    centerLat?: SortOrder
    centerLng?: SortOrder
    nameMatchConfidence?: SortOrder
    nameMatchStatus?: SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrder
    kycApprovedAt?: SortOrder
    kycRejectedAt?: SortOrder
    kycRejectionReason?: SortOrder
    readyToIntegrate?: SortOrder
    landOwnershipType?: SortOrder
    casteCategory?: SortOrder
    isIncomeTaxPayer?: SortOrder
    isGovtEmployee?: SortOrder
    hasKCC?: SortOrder
    hasAadhaarLinkedBank?: SortOrder
    hasLivestock?: SortOrder
    farmingType?: SortOrder
    cropsGrown?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FarmerProfileAvgOrderByAggregateInput = {
    annualIncomeINR?: SortOrder
    totalExtentAcres?: SortOrder
    centerLat?: SortOrder
    centerLng?: SortOrder
    nameMatchConfidence?: SortOrder
  }

  export type FarmerProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userMongoId?: SortOrder
    ethAddress?: SortOrder
    annualIncomeINR?: SortOrder
    nameEnglish?: SortOrder
    nameKannada?: SortOrder
    nameDisplay?: SortOrder
    nameNormalized?: SortOrder
    dob?: SortOrder
    gender?: SortOrder
    aadhaarAddress?: SortOrder
    aadhaarVerified?: SortOrder
    aadhaarDocCid?: SortOrder
    aadhaarCloudUrl?: SortOrder
    district?: SortOrder
    taluk?: SortOrder
    hobli?: SortOrder
    village?: SortOrder
    surveyNumber?: SortOrder
    hissaNumber?: SortOrder
    totalExtentRaw?: SortOrder
    totalExtentAcres?: SortOrder
    soilType?: SortOrder
    irrigationType?: SortOrder
    rtcOwnerName?: SortOrder
    rtcVerified?: SortOrder
    rtcDocCid?: SortOrder
    rtcCloudUrl?: SortOrder
    landSketchUrl?: SortOrder
    centerLat?: SortOrder
    centerLng?: SortOrder
    nameMatchConfidence?: SortOrder
    nameMatchStatus?: SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrder
    kycApprovedAt?: SortOrder
    kycRejectedAt?: SortOrder
    kycRejectionReason?: SortOrder
    readyToIntegrate?: SortOrder
    landOwnershipType?: SortOrder
    casteCategory?: SortOrder
    isIncomeTaxPayer?: SortOrder
    isGovtEmployee?: SortOrder
    hasKCC?: SortOrder
    hasAadhaarLinkedBank?: SortOrder
    hasLivestock?: SortOrder
    farmingType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FarmerProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userMongoId?: SortOrder
    ethAddress?: SortOrder
    annualIncomeINR?: SortOrder
    nameEnglish?: SortOrder
    nameKannada?: SortOrder
    nameDisplay?: SortOrder
    nameNormalized?: SortOrder
    dob?: SortOrder
    gender?: SortOrder
    aadhaarAddress?: SortOrder
    aadhaarVerified?: SortOrder
    aadhaarDocCid?: SortOrder
    aadhaarCloudUrl?: SortOrder
    district?: SortOrder
    taluk?: SortOrder
    hobli?: SortOrder
    village?: SortOrder
    surveyNumber?: SortOrder
    hissaNumber?: SortOrder
    totalExtentRaw?: SortOrder
    totalExtentAcres?: SortOrder
    soilType?: SortOrder
    irrigationType?: SortOrder
    rtcOwnerName?: SortOrder
    rtcVerified?: SortOrder
    rtcDocCid?: SortOrder
    rtcCloudUrl?: SortOrder
    landSketchUrl?: SortOrder
    centerLat?: SortOrder
    centerLng?: SortOrder
    nameMatchConfidence?: SortOrder
    nameMatchStatus?: SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrder
    kycApprovedAt?: SortOrder
    kycRejectedAt?: SortOrder
    kycRejectionReason?: SortOrder
    readyToIntegrate?: SortOrder
    landOwnershipType?: SortOrder
    casteCategory?: SortOrder
    isIncomeTaxPayer?: SortOrder
    isGovtEmployee?: SortOrder
    hasKCC?: SortOrder
    hasAadhaarLinkedBank?: SortOrder
    hasLivestock?: SortOrder
    farmingType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FarmerProfileSumOrderByAggregateInput = {
    annualIncomeINR?: SortOrder
    totalExtentAcres?: SortOrder
    centerLat?: SortOrder
    centerLng?: SortOrder
    nameMatchConfidence?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type LandAgreementIndexCountOrderByAggregateInput = {
    id?: SortOrder
    agreementId?: SortOrder
    creatorUserId?: SortOrder
    partnerUserId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type LandAgreementIndexMaxOrderByAggregateInput = {
    id?: SortOrder
    agreementId?: SortOrder
    creatorUserId?: SortOrder
    partnerUserId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type LandAgreementIndexMinOrderByAggregateInput = {
    id?: SortOrder
    agreementId?: SortOrder
    creatorUserId?: SortOrder
    partnerUserId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type FarmerProfileCreatecropsGrownInput = {
    set: string[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type FarmerProfileUpdatecropsGrownInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}