
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
 * Model Supplier
 * 
 */
export type Supplier = $Result.DefaultSelection<Prisma.$SupplierPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model InventoryLog
 * 
 */
export type InventoryLog = $Result.DefaultSelection<Prisma.$InventoryLogPayload>
/**
 * Model SupplierOrder
 * 
 */
export type SupplierOrder = $Result.DefaultSelection<Prisma.$SupplierOrderPayload>
/**
 * Model DailyAnalytics
 * 
 */
export type DailyAnalytics = $Result.DefaultSelection<Prisma.$DailyAnalyticsPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const VerificationStatus: {
  NOT_STARTED: 'NOT_STARTED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus]

}

export type VerificationStatus = $Enums.VerificationStatus

export const VerificationStatus: typeof $Enums.VerificationStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Suppliers
 * const suppliers = await prisma.supplier.findMany()
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
   * // Fetch zero or more Suppliers
   * const suppliers = await prisma.supplier.findMany()
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
   * `prisma.supplier`: Exposes CRUD operations for the **Supplier** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Suppliers
    * const suppliers = await prisma.supplier.findMany()
    * ```
    */
  get supplier(): Prisma.SupplierDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventoryLog`: Exposes CRUD operations for the **InventoryLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryLogs
    * const inventoryLogs = await prisma.inventoryLog.findMany()
    * ```
    */
  get inventoryLog(): Prisma.InventoryLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.supplierOrder`: Exposes CRUD operations for the **SupplierOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SupplierOrders
    * const supplierOrders = await prisma.supplierOrder.findMany()
    * ```
    */
  get supplierOrder(): Prisma.SupplierOrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dailyAnalytics`: Exposes CRUD operations for the **DailyAnalytics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DailyAnalytics
    * const dailyAnalytics = await prisma.dailyAnalytics.findMany()
    * ```
    */
  get dailyAnalytics(): Prisma.DailyAnalyticsDelegate<ExtArgs, ClientOptions>;
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
    Supplier: 'Supplier',
    Product: 'Product',
    InventoryLog: 'InventoryLog',
    SupplierOrder: 'SupplierOrder',
    DailyAnalytics: 'DailyAnalytics'
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
      modelProps: "supplier" | "product" | "inventoryLog" | "supplierOrder" | "dailyAnalytics"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Supplier: {
        payload: Prisma.$SupplierPayload<ExtArgs>
        fields: Prisma.SupplierFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupplierFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupplierFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findFirst: {
            args: Prisma.SupplierFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupplierFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findMany: {
            args: Prisma.SupplierFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          create: {
            args: Prisma.SupplierCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          createMany: {
            args: Prisma.SupplierCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupplierCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          delete: {
            args: Prisma.SupplierDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          update: {
            args: Prisma.SupplierUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          deleteMany: {
            args: Prisma.SupplierDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupplierUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SupplierUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          upsert: {
            args: Prisma.SupplierUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          aggregate: {
            args: Prisma.SupplierAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupplier>
          }
          groupBy: {
            args: Prisma.SupplierGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupplierGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupplierCountArgs<ExtArgs>
            result: $Utils.Optional<SupplierCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      InventoryLog: {
        payload: Prisma.$InventoryLogPayload<ExtArgs>
        fields: Prisma.InventoryLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          findFirst: {
            args: Prisma.InventoryLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          findMany: {
            args: Prisma.InventoryLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>[]
          }
          create: {
            args: Prisma.InventoryLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          createMany: {
            args: Prisma.InventoryLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>[]
          }
          delete: {
            args: Prisma.InventoryLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          update: {
            args: Prisma.InventoryLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          deleteMany: {
            args: Prisma.InventoryLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InventoryLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>[]
          }
          upsert: {
            args: Prisma.InventoryLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLogPayload>
          }
          aggregate: {
            args: Prisma.InventoryLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryLog>
          }
          groupBy: {
            args: Prisma.InventoryLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryLogCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryLogCountAggregateOutputType> | number
          }
        }
      }
      SupplierOrder: {
        payload: Prisma.$SupplierOrderPayload<ExtArgs>
        fields: Prisma.SupplierOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupplierOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupplierOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderPayload>
          }
          findFirst: {
            args: Prisma.SupplierOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupplierOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderPayload>
          }
          findMany: {
            args: Prisma.SupplierOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderPayload>[]
          }
          create: {
            args: Prisma.SupplierOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderPayload>
          }
          createMany: {
            args: Prisma.SupplierOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupplierOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderPayload>[]
          }
          delete: {
            args: Prisma.SupplierOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderPayload>
          }
          update: {
            args: Prisma.SupplierOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderPayload>
          }
          deleteMany: {
            args: Prisma.SupplierOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupplierOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SupplierOrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderPayload>[]
          }
          upsert: {
            args: Prisma.SupplierOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderPayload>
          }
          aggregate: {
            args: Prisma.SupplierOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupplierOrder>
          }
          groupBy: {
            args: Prisma.SupplierOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupplierOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupplierOrderCountArgs<ExtArgs>
            result: $Utils.Optional<SupplierOrderCountAggregateOutputType> | number
          }
        }
      }
      DailyAnalytics: {
        payload: Prisma.$DailyAnalyticsPayload<ExtArgs>
        fields: Prisma.DailyAnalyticsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DailyAnalyticsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyAnalyticsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DailyAnalyticsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyAnalyticsPayload>
          }
          findFirst: {
            args: Prisma.DailyAnalyticsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyAnalyticsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DailyAnalyticsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyAnalyticsPayload>
          }
          findMany: {
            args: Prisma.DailyAnalyticsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyAnalyticsPayload>[]
          }
          create: {
            args: Prisma.DailyAnalyticsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyAnalyticsPayload>
          }
          createMany: {
            args: Prisma.DailyAnalyticsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DailyAnalyticsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyAnalyticsPayload>[]
          }
          delete: {
            args: Prisma.DailyAnalyticsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyAnalyticsPayload>
          }
          update: {
            args: Prisma.DailyAnalyticsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyAnalyticsPayload>
          }
          deleteMany: {
            args: Prisma.DailyAnalyticsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DailyAnalyticsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DailyAnalyticsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyAnalyticsPayload>[]
          }
          upsert: {
            args: Prisma.DailyAnalyticsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyAnalyticsPayload>
          }
          aggregate: {
            args: Prisma.DailyAnalyticsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDailyAnalytics>
          }
          groupBy: {
            args: Prisma.DailyAnalyticsGroupByArgs<ExtArgs>
            result: $Utils.Optional<DailyAnalyticsGroupByOutputType>[]
          }
          count: {
            args: Prisma.DailyAnalyticsCountArgs<ExtArgs>
            result: $Utils.Optional<DailyAnalyticsCountAggregateOutputType> | number
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
    supplier?: SupplierOmit
    product?: ProductOmit
    inventoryLog?: InventoryLogOmit
    supplierOrder?: SupplierOrderOmit
    dailyAnalytics?: DailyAnalyticsOmit
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
   * Count Type SupplierCountOutputType
   */

  export type SupplierCountOutputType = {
    products: number
    orders: number
    analytics: number
  }

  export type SupplierCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | SupplierCountOutputTypeCountProductsArgs
    orders?: boolean | SupplierCountOutputTypeCountOrdersArgs
    analytics?: boolean | SupplierCountOutputTypeCountAnalyticsArgs
  }

  // Custom InputTypes
  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierCountOutputType
     */
    select?: SupplierCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }

  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierOrderWhereInput
  }

  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeCountAnalyticsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyAnalyticsWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    inventoryLogs: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventoryLogs?: boolean | ProductCountOutputTypeCountInventoryLogsArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountInventoryLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Supplier
   */

  export type AggregateSupplier = {
    _count: SupplierCountAggregateOutputType | null
    _avg: SupplierAvgAggregateOutputType | null
    _sum: SupplierSumAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  export type SupplierAvgAggregateOutputType = {
    taxRate: number | null
  }

  export type SupplierSumAggregateOutputType = {
    taxRate: number | null
  }

  export type SupplierMinAggregateOutputType = {
    id: string | null
    userId: string | null
    companyName: string | null
    email: string | null
    phone: string | null
    upiId: string | null
    gstNumber: string | null
    avatarUrl: string | null
    businessType: string | null
    yearsInOperation: string | null
    businessCertUrl: string | null
    tradeLicenseUrl: string | null
    ownerIdProofUrl: string | null
    gstCertUrl: string | null
    kycStatus: $Enums.VerificationStatus | null
    kycSubmittedAt: Date | null
    kycReviewedAt: Date | null
    kycReviewedBy: string | null
    taxRate: number | null
    taxInclusive: boolean | null
    kycRejectionReason: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    companyName: string | null
    email: string | null
    phone: string | null
    upiId: string | null
    gstNumber: string | null
    avatarUrl: string | null
    businessType: string | null
    yearsInOperation: string | null
    businessCertUrl: string | null
    tradeLicenseUrl: string | null
    ownerIdProofUrl: string | null
    gstCertUrl: string | null
    kycStatus: $Enums.VerificationStatus | null
    kycSubmittedAt: Date | null
    kycReviewedAt: Date | null
    kycReviewedBy: string | null
    taxRate: number | null
    taxInclusive: boolean | null
    kycRejectionReason: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierCountAggregateOutputType = {
    id: number
    userId: number
    companyName: number
    email: number
    phone: number
    upiId: number
    gstNumber: number
    avatarUrl: number
    address: number
    businessType: number
    yearsInOperation: number
    productCategories: number
    businessCertUrl: number
    tradeLicenseUrl: number
    ownerIdProofUrl: number
    gstCertUrl: number
    kycStatus: number
    kycSubmittedAt: number
    kycReviewedAt: number
    kycReviewedBy: number
    taxRate: number
    taxInclusive: number
    kycRejectionReason: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SupplierAvgAggregateInputType = {
    taxRate?: true
  }

  export type SupplierSumAggregateInputType = {
    taxRate?: true
  }

  export type SupplierMinAggregateInputType = {
    id?: true
    userId?: true
    companyName?: true
    email?: true
    phone?: true
    upiId?: true
    gstNumber?: true
    avatarUrl?: true
    businessType?: true
    yearsInOperation?: true
    businessCertUrl?: true
    tradeLicenseUrl?: true
    ownerIdProofUrl?: true
    gstCertUrl?: true
    kycStatus?: true
    kycSubmittedAt?: true
    kycReviewedAt?: true
    kycReviewedBy?: true
    taxRate?: true
    taxInclusive?: true
    kycRejectionReason?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierMaxAggregateInputType = {
    id?: true
    userId?: true
    companyName?: true
    email?: true
    phone?: true
    upiId?: true
    gstNumber?: true
    avatarUrl?: true
    businessType?: true
    yearsInOperation?: true
    businessCertUrl?: true
    tradeLicenseUrl?: true
    ownerIdProofUrl?: true
    gstCertUrl?: true
    kycStatus?: true
    kycSubmittedAt?: true
    kycReviewedAt?: true
    kycReviewedBy?: true
    taxRate?: true
    taxInclusive?: true
    kycRejectionReason?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierCountAggregateInputType = {
    id?: true
    userId?: true
    companyName?: true
    email?: true
    phone?: true
    upiId?: true
    gstNumber?: true
    avatarUrl?: true
    address?: true
    businessType?: true
    yearsInOperation?: true
    productCategories?: true
    businessCertUrl?: true
    tradeLicenseUrl?: true
    ownerIdProofUrl?: true
    gstCertUrl?: true
    kycStatus?: true
    kycSubmittedAt?: true
    kycReviewedAt?: true
    kycReviewedBy?: true
    taxRate?: true
    taxInclusive?: true
    kycRejectionReason?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SupplierAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Supplier to aggregate.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Suppliers
    **/
    _count?: true | SupplierCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SupplierAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SupplierSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupplierMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupplierMaxAggregateInputType
  }

  export type GetSupplierAggregateType<T extends SupplierAggregateArgs> = {
        [P in keyof T & keyof AggregateSupplier]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupplier[P]>
      : GetScalarType<T[P], AggregateSupplier[P]>
  }




  export type SupplierGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierWhereInput
    orderBy?: SupplierOrderByWithAggregationInput | SupplierOrderByWithAggregationInput[]
    by: SupplierScalarFieldEnum[] | SupplierScalarFieldEnum
    having?: SupplierScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupplierCountAggregateInputType | true
    _avg?: SupplierAvgAggregateInputType
    _sum?: SupplierSumAggregateInputType
    _min?: SupplierMinAggregateInputType
    _max?: SupplierMaxAggregateInputType
  }

  export type SupplierGroupByOutputType = {
    id: string
    userId: string
    companyName: string
    email: string
    phone: string
    upiId: string | null
    gstNumber: string | null
    avatarUrl: string | null
    address: JsonValue
    businessType: string | null
    yearsInOperation: string | null
    productCategories: string[]
    businessCertUrl: string | null
    tradeLicenseUrl: string | null
    ownerIdProofUrl: string | null
    gstCertUrl: string | null
    kycStatus: $Enums.VerificationStatus
    kycSubmittedAt: Date | null
    kycReviewedAt: Date | null
    kycReviewedBy: string | null
    taxRate: number | null
    taxInclusive: boolean
    kycRejectionReason: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: SupplierCountAggregateOutputType | null
    _avg: SupplierAvgAggregateOutputType | null
    _sum: SupplierSumAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  type GetSupplierGroupByPayload<T extends SupplierGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupplierGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupplierGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupplierGroupByOutputType[P]>
            : GetScalarType<T[P], SupplierGroupByOutputType[P]>
        }
      >
    >


  export type SupplierSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    companyName?: boolean
    email?: boolean
    phone?: boolean
    upiId?: boolean
    gstNumber?: boolean
    avatarUrl?: boolean
    address?: boolean
    businessType?: boolean
    yearsInOperation?: boolean
    productCategories?: boolean
    businessCertUrl?: boolean
    tradeLicenseUrl?: boolean
    ownerIdProofUrl?: boolean
    gstCertUrl?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycReviewedAt?: boolean
    kycReviewedBy?: boolean
    taxRate?: boolean
    taxInclusive?: boolean
    kycRejectionReason?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    products?: boolean | Supplier$productsArgs<ExtArgs>
    orders?: boolean | Supplier$ordersArgs<ExtArgs>
    analytics?: boolean | Supplier$analyticsArgs<ExtArgs>
    _count?: boolean | SupplierCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    companyName?: boolean
    email?: boolean
    phone?: boolean
    upiId?: boolean
    gstNumber?: boolean
    avatarUrl?: boolean
    address?: boolean
    businessType?: boolean
    yearsInOperation?: boolean
    productCategories?: boolean
    businessCertUrl?: boolean
    tradeLicenseUrl?: boolean
    ownerIdProofUrl?: boolean
    gstCertUrl?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycReviewedAt?: boolean
    kycReviewedBy?: boolean
    taxRate?: boolean
    taxInclusive?: boolean
    kycRejectionReason?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    companyName?: boolean
    email?: boolean
    phone?: boolean
    upiId?: boolean
    gstNumber?: boolean
    avatarUrl?: boolean
    address?: boolean
    businessType?: boolean
    yearsInOperation?: boolean
    productCategories?: boolean
    businessCertUrl?: boolean
    tradeLicenseUrl?: boolean
    ownerIdProofUrl?: boolean
    gstCertUrl?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycReviewedAt?: boolean
    kycReviewedBy?: boolean
    taxRate?: boolean
    taxInclusive?: boolean
    kycRejectionReason?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectScalar = {
    id?: boolean
    userId?: boolean
    companyName?: boolean
    email?: boolean
    phone?: boolean
    upiId?: boolean
    gstNumber?: boolean
    avatarUrl?: boolean
    address?: boolean
    businessType?: boolean
    yearsInOperation?: boolean
    productCategories?: boolean
    businessCertUrl?: boolean
    tradeLicenseUrl?: boolean
    ownerIdProofUrl?: boolean
    gstCertUrl?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycReviewedAt?: boolean
    kycReviewedBy?: boolean
    taxRate?: boolean
    taxInclusive?: boolean
    kycRejectionReason?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SupplierOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "companyName" | "email" | "phone" | "upiId" | "gstNumber" | "avatarUrl" | "address" | "businessType" | "yearsInOperation" | "productCategories" | "businessCertUrl" | "tradeLicenseUrl" | "ownerIdProofUrl" | "gstCertUrl" | "kycStatus" | "kycSubmittedAt" | "kycReviewedAt" | "kycReviewedBy" | "taxRate" | "taxInclusive" | "kycRejectionReason" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["supplier"]>
  export type SupplierInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | Supplier$productsArgs<ExtArgs>
    orders?: boolean | Supplier$ordersArgs<ExtArgs>
    analytics?: boolean | Supplier$analyticsArgs<ExtArgs>
    _count?: boolean | SupplierCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SupplierIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SupplierIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SupplierPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Supplier"
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[]
      orders: Prisma.$SupplierOrderPayload<ExtArgs>[]
      analytics: Prisma.$DailyAnalyticsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      companyName: string
      email: string
      phone: string
      upiId: string | null
      gstNumber: string | null
      avatarUrl: string | null
      address: Prisma.JsonValue
      businessType: string | null
      yearsInOperation: string | null
      productCategories: string[]
      businessCertUrl: string | null
      tradeLicenseUrl: string | null
      ownerIdProofUrl: string | null
      gstCertUrl: string | null
      kycStatus: $Enums.VerificationStatus
      kycSubmittedAt: Date | null
      kycReviewedAt: Date | null
      kycReviewedBy: string | null
      taxRate: number | null
      taxInclusive: boolean
      kycRejectionReason: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["supplier"]>
    composites: {}
  }

  type SupplierGetPayload<S extends boolean | null | undefined | SupplierDefaultArgs> = $Result.GetResult<Prisma.$SupplierPayload, S>

  type SupplierCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SupplierFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SupplierCountAggregateInputType | true
    }

  export interface SupplierDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Supplier'], meta: { name: 'Supplier' } }
    /**
     * Find zero or one Supplier that matches the filter.
     * @param {SupplierFindUniqueArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupplierFindUniqueArgs>(args: SelectSubset<T, SupplierFindUniqueArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Supplier that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SupplierFindUniqueOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupplierFindUniqueOrThrowArgs>(args: SelectSubset<T, SupplierFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupplierFindFirstArgs>(args?: SelectSubset<T, SupplierFindFirstArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupplierFindFirstOrThrowArgs>(args?: SelectSubset<T, SupplierFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Suppliers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Suppliers
     * const suppliers = await prisma.supplier.findMany()
     * 
     * // Get first 10 Suppliers
     * const suppliers = await prisma.supplier.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const supplierWithIdOnly = await prisma.supplier.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SupplierFindManyArgs>(args?: SelectSubset<T, SupplierFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Supplier.
     * @param {SupplierCreateArgs} args - Arguments to create a Supplier.
     * @example
     * // Create one Supplier
     * const Supplier = await prisma.supplier.create({
     *   data: {
     *     // ... data to create a Supplier
     *   }
     * })
     * 
     */
    create<T extends SupplierCreateArgs>(args: SelectSubset<T, SupplierCreateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Suppliers.
     * @param {SupplierCreateManyArgs} args - Arguments to create many Suppliers.
     * @example
     * // Create many Suppliers
     * const supplier = await prisma.supplier.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupplierCreateManyArgs>(args?: SelectSubset<T, SupplierCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Suppliers and returns the data saved in the database.
     * @param {SupplierCreateManyAndReturnArgs} args - Arguments to create many Suppliers.
     * @example
     * // Create many Suppliers
     * const supplier = await prisma.supplier.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Suppliers and only return the `id`
     * const supplierWithIdOnly = await prisma.supplier.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupplierCreateManyAndReturnArgs>(args?: SelectSubset<T, SupplierCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Supplier.
     * @param {SupplierDeleteArgs} args - Arguments to delete one Supplier.
     * @example
     * // Delete one Supplier
     * const Supplier = await prisma.supplier.delete({
     *   where: {
     *     // ... filter to delete one Supplier
     *   }
     * })
     * 
     */
    delete<T extends SupplierDeleteArgs>(args: SelectSubset<T, SupplierDeleteArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Supplier.
     * @param {SupplierUpdateArgs} args - Arguments to update one Supplier.
     * @example
     * // Update one Supplier
     * const supplier = await prisma.supplier.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupplierUpdateArgs>(args: SelectSubset<T, SupplierUpdateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Suppliers.
     * @param {SupplierDeleteManyArgs} args - Arguments to filter Suppliers to delete.
     * @example
     * // Delete a few Suppliers
     * const { count } = await prisma.supplier.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupplierDeleteManyArgs>(args?: SelectSubset<T, SupplierDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Suppliers
     * const supplier = await prisma.supplier.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupplierUpdateManyArgs>(args: SelectSubset<T, SupplierUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Suppliers and returns the data updated in the database.
     * @param {SupplierUpdateManyAndReturnArgs} args - Arguments to update many Suppliers.
     * @example
     * // Update many Suppliers
     * const supplier = await prisma.supplier.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Suppliers and only return the `id`
     * const supplierWithIdOnly = await prisma.supplier.updateManyAndReturn({
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
    updateManyAndReturn<T extends SupplierUpdateManyAndReturnArgs>(args: SelectSubset<T, SupplierUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Supplier.
     * @param {SupplierUpsertArgs} args - Arguments to update or create a Supplier.
     * @example
     * // Update or create a Supplier
     * const supplier = await prisma.supplier.upsert({
     *   create: {
     *     // ... data to create a Supplier
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Supplier we want to update
     *   }
     * })
     */
    upsert<T extends SupplierUpsertArgs>(args: SelectSubset<T, SupplierUpsertArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierCountArgs} args - Arguments to filter Suppliers to count.
     * @example
     * // Count the number of Suppliers
     * const count = await prisma.supplier.count({
     *   where: {
     *     // ... the filter for the Suppliers we want to count
     *   }
     * })
    **/
    count<T extends SupplierCountArgs>(
      args?: Subset<T, SupplierCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupplierCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SupplierAggregateArgs>(args: Subset<T, SupplierAggregateArgs>): Prisma.PrismaPromise<GetSupplierAggregateType<T>>

    /**
     * Group by Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGroupByArgs} args - Group by arguments.
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
      T extends SupplierGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupplierGroupByArgs['orderBy'] }
        : { orderBy?: SupplierGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SupplierGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Supplier model
   */
  readonly fields: SupplierFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Supplier.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupplierClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends Supplier$productsArgs<ExtArgs> = {}>(args?: Subset<T, Supplier$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    orders<T extends Supplier$ordersArgs<ExtArgs> = {}>(args?: Subset<T, Supplier$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    analytics<T extends Supplier$analyticsArgs<ExtArgs> = {}>(args?: Subset<T, Supplier$analyticsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Supplier model
   */
  interface SupplierFieldRefs {
    readonly id: FieldRef<"Supplier", 'String'>
    readonly userId: FieldRef<"Supplier", 'String'>
    readonly companyName: FieldRef<"Supplier", 'String'>
    readonly email: FieldRef<"Supplier", 'String'>
    readonly phone: FieldRef<"Supplier", 'String'>
    readonly upiId: FieldRef<"Supplier", 'String'>
    readonly gstNumber: FieldRef<"Supplier", 'String'>
    readonly avatarUrl: FieldRef<"Supplier", 'String'>
    readonly address: FieldRef<"Supplier", 'Json'>
    readonly businessType: FieldRef<"Supplier", 'String'>
    readonly yearsInOperation: FieldRef<"Supplier", 'String'>
    readonly productCategories: FieldRef<"Supplier", 'String[]'>
    readonly businessCertUrl: FieldRef<"Supplier", 'String'>
    readonly tradeLicenseUrl: FieldRef<"Supplier", 'String'>
    readonly ownerIdProofUrl: FieldRef<"Supplier", 'String'>
    readonly gstCertUrl: FieldRef<"Supplier", 'String'>
    readonly kycStatus: FieldRef<"Supplier", 'VerificationStatus'>
    readonly kycSubmittedAt: FieldRef<"Supplier", 'DateTime'>
    readonly kycReviewedAt: FieldRef<"Supplier", 'DateTime'>
    readonly kycReviewedBy: FieldRef<"Supplier", 'String'>
    readonly taxRate: FieldRef<"Supplier", 'Float'>
    readonly taxInclusive: FieldRef<"Supplier", 'Boolean'>
    readonly kycRejectionReason: FieldRef<"Supplier", 'String'>
    readonly isActive: FieldRef<"Supplier", 'Boolean'>
    readonly createdAt: FieldRef<"Supplier", 'DateTime'>
    readonly updatedAt: FieldRef<"Supplier", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Supplier findUnique
   */
  export type SupplierFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findUniqueOrThrow
   */
  export type SupplierFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findFirst
   */
  export type SupplierFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findFirstOrThrow
   */
  export type SupplierFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findMany
   */
  export type SupplierFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Suppliers to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier create
   */
  export type SupplierCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The data needed to create a Supplier.
     */
    data: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
  }

  /**
   * Supplier createMany
   */
  export type SupplierCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Suppliers.
     */
    data: SupplierCreateManyInput | SupplierCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Supplier createManyAndReturn
   */
  export type SupplierCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * The data used to create many Suppliers.
     */
    data: SupplierCreateManyInput | SupplierCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Supplier update
   */
  export type SupplierUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The data needed to update a Supplier.
     */
    data: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
    /**
     * Choose, which Supplier to update.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier updateMany
   */
  export type SupplierUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Suppliers.
     */
    data: XOR<SupplierUpdateManyMutationInput, SupplierUncheckedUpdateManyInput>
    /**
     * Filter which Suppliers to update
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to update.
     */
    limit?: number
  }

  /**
   * Supplier updateManyAndReturn
   */
  export type SupplierUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * The data used to update Suppliers.
     */
    data: XOR<SupplierUpdateManyMutationInput, SupplierUncheckedUpdateManyInput>
    /**
     * Filter which Suppliers to update
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to update.
     */
    limit?: number
  }

  /**
   * Supplier upsert
   */
  export type SupplierUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The filter to search for the Supplier to update in case it exists.
     */
    where: SupplierWhereUniqueInput
    /**
     * In case the Supplier found by the `where` argument doesn't exist, create a new Supplier with this data.
     */
    create: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
    /**
     * In case the Supplier was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
  }

  /**
   * Supplier delete
   */
  export type SupplierDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter which Supplier to delete.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier deleteMany
   */
  export type SupplierDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Suppliers to delete
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to delete.
     */
    limit?: number
  }

  /**
   * Supplier.products
   */
  export type Supplier$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Supplier.orders
   */
  export type Supplier$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderInclude<ExtArgs> | null
    where?: SupplierOrderWhereInput
    orderBy?: SupplierOrderOrderByWithRelationInput | SupplierOrderOrderByWithRelationInput[]
    cursor?: SupplierOrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SupplierOrderScalarFieldEnum | SupplierOrderScalarFieldEnum[]
  }

  /**
   * Supplier.analytics
   */
  export type Supplier$analyticsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsInclude<ExtArgs> | null
    where?: DailyAnalyticsWhereInput
    orderBy?: DailyAnalyticsOrderByWithRelationInput | DailyAnalyticsOrderByWithRelationInput[]
    cursor?: DailyAnalyticsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DailyAnalyticsScalarFieldEnum | DailyAnalyticsScalarFieldEnum[]
  }

  /**
   * Supplier without action
   */
  export type SupplierDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    price: number | null
    mrp: number | null
    stockQuantity: number | null
    reorderThreshold: number | null
    weight: number | null
    rating: number | null
    reviewCount: number | null
  }

  export type ProductSumAggregateOutputType = {
    price: number | null
    mrp: number | null
    stockQuantity: number | null
    reorderThreshold: number | null
    weight: number | null
    rating: number | null
    reviewCount: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    supplierId: string | null
    name: string | null
    slug: string | null
    sku: string | null
    category: string | null
    description: string | null
    price: number | null
    mrp: number | null
    unit: string | null
    stockQuantity: number | null
    reorderThreshold: number | null
    status: string | null
    weight: number | null
    rating: number | null
    reviewCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    supplierId: string | null
    name: string | null
    slug: string | null
    sku: string | null
    category: string | null
    description: string | null
    price: number | null
    mrp: number | null
    unit: string | null
    stockQuantity: number | null
    reorderThreshold: number | null
    status: string | null
    weight: number | null
    rating: number | null
    reviewCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    supplierId: number
    name: number
    slug: number
    sku: number
    category: number
    description: number
    price: number
    mrp: number
    unit: number
    stockQuantity: number
    reorderThreshold: number
    images: number
    tags: number
    status: number
    specifications: number
    weight: number
    rating: number
    reviewCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    price?: true
    mrp?: true
    stockQuantity?: true
    reorderThreshold?: true
    weight?: true
    rating?: true
    reviewCount?: true
  }

  export type ProductSumAggregateInputType = {
    price?: true
    mrp?: true
    stockQuantity?: true
    reorderThreshold?: true
    weight?: true
    rating?: true
    reviewCount?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    supplierId?: true
    name?: true
    slug?: true
    sku?: true
    category?: true
    description?: true
    price?: true
    mrp?: true
    unit?: true
    stockQuantity?: true
    reorderThreshold?: true
    status?: true
    weight?: true
    rating?: true
    reviewCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    supplierId?: true
    name?: true
    slug?: true
    sku?: true
    category?: true
    description?: true
    price?: true
    mrp?: true
    unit?: true
    stockQuantity?: true
    reorderThreshold?: true
    status?: true
    weight?: true
    rating?: true
    reviewCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    supplierId?: true
    name?: true
    slug?: true
    sku?: true
    category?: true
    description?: true
    price?: true
    mrp?: true
    unit?: true
    stockQuantity?: true
    reorderThreshold?: true
    images?: true
    tags?: true
    status?: true
    specifications?: true
    weight?: true
    rating?: true
    reviewCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    supplierId: string
    name: string
    slug: string
    sku: string
    category: string
    description: string
    price: number
    mrp: number
    unit: string
    stockQuantity: number
    reorderThreshold: number
    images: string[]
    tags: string[]
    status: string
    specifications: JsonValue | null
    weight: number | null
    rating: number | null
    reviewCount: number
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    supplierId?: boolean
    name?: boolean
    slug?: boolean
    sku?: boolean
    category?: boolean
    description?: boolean
    price?: boolean
    mrp?: boolean
    unit?: boolean
    stockQuantity?: boolean
    reorderThreshold?: boolean
    images?: boolean
    tags?: boolean
    status?: boolean
    specifications?: boolean
    weight?: boolean
    rating?: boolean
    reviewCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
    inventoryLogs?: boolean | Product$inventoryLogsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    supplierId?: boolean
    name?: boolean
    slug?: boolean
    sku?: boolean
    category?: boolean
    description?: boolean
    price?: boolean
    mrp?: boolean
    unit?: boolean
    stockQuantity?: boolean
    reorderThreshold?: boolean
    images?: boolean
    tags?: boolean
    status?: boolean
    specifications?: boolean
    weight?: boolean
    rating?: boolean
    reviewCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    supplierId?: boolean
    name?: boolean
    slug?: boolean
    sku?: boolean
    category?: boolean
    description?: boolean
    price?: boolean
    mrp?: boolean
    unit?: boolean
    stockQuantity?: boolean
    reorderThreshold?: boolean
    images?: boolean
    tags?: boolean
    status?: boolean
    specifications?: boolean
    weight?: boolean
    rating?: boolean
    reviewCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    supplierId?: boolean
    name?: boolean
    slug?: boolean
    sku?: boolean
    category?: boolean
    description?: boolean
    price?: boolean
    mrp?: boolean
    unit?: boolean
    stockQuantity?: boolean
    reorderThreshold?: boolean
    images?: boolean
    tags?: boolean
    status?: boolean
    specifications?: boolean
    weight?: boolean
    rating?: boolean
    reviewCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "supplierId" | "name" | "slug" | "sku" | "category" | "description" | "price" | "mrp" | "unit" | "stockQuantity" | "reorderThreshold" | "images" | "tags" | "status" | "specifications" | "weight" | "rating" | "reviewCount" | "createdAt" | "updatedAt", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
    inventoryLogs?: boolean | Product$inventoryLogsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }
  export type ProductIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      supplier: Prisma.$SupplierPayload<ExtArgs>
      inventoryLogs: Prisma.$InventoryLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      supplierId: string
      name: string
      slug: string
      sku: string
      category: string
      description: string
      price: number
      mrp: number
      unit: string
      stockQuantity: number
      reorderThreshold: number
      images: string[]
      tags: string[]
      status: string
      specifications: Prisma.JsonValue | null
      weight: number | null
      rating: number | null
      reviewCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {ProductUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productWithIdOnly = await prisma.product.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProductUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
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
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    supplier<T extends SupplierDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SupplierDefaultArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    inventoryLogs<T extends Product$inventoryLogsArgs<ExtArgs> = {}>(args?: Subset<T, Product$inventoryLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly supplierId: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly slug: FieldRef<"Product", 'String'>
    readonly sku: FieldRef<"Product", 'String'>
    readonly category: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly price: FieldRef<"Product", 'Int'>
    readonly mrp: FieldRef<"Product", 'Int'>
    readonly unit: FieldRef<"Product", 'String'>
    readonly stockQuantity: FieldRef<"Product", 'Int'>
    readonly reorderThreshold: FieldRef<"Product", 'Int'>
    readonly images: FieldRef<"Product", 'String[]'>
    readonly tags: FieldRef<"Product", 'String[]'>
    readonly status: FieldRef<"Product", 'String'>
    readonly specifications: FieldRef<"Product", 'Json'>
    readonly weight: FieldRef<"Product", 'Float'>
    readonly rating: FieldRef<"Product", 'Float'>
    readonly reviewCount: FieldRef<"Product", 'Int'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product updateManyAndReturn
   */
  export type ProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.inventoryLogs
   */
  export type Product$inventoryLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    where?: InventoryLogWhereInput
    orderBy?: InventoryLogOrderByWithRelationInput | InventoryLogOrderByWithRelationInput[]
    cursor?: InventoryLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryLogScalarFieldEnum | InventoryLogScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model InventoryLog
   */

  export type AggregateInventoryLog = {
    _count: InventoryLogCountAggregateOutputType | null
    _avg: InventoryLogAvgAggregateOutputType | null
    _sum: InventoryLogSumAggregateOutputType | null
    _min: InventoryLogMinAggregateOutputType | null
    _max: InventoryLogMaxAggregateOutputType | null
  }

  export type InventoryLogAvgAggregateOutputType = {
    change: number | null
    previousStock: number | null
    newStock: number | null
  }

  export type InventoryLogSumAggregateOutputType = {
    change: number | null
    previousStock: number | null
    newStock: number | null
  }

  export type InventoryLogMinAggregateOutputType = {
    id: string | null
    productId: string | null
    supplierId: string | null
    change: number | null
    reason: string | null
    referenceId: string | null
    previousStock: number | null
    newStock: number | null
    notes: string | null
    createdAt: Date | null
  }

  export type InventoryLogMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    supplierId: string | null
    change: number | null
    reason: string | null
    referenceId: string | null
    previousStock: number | null
    newStock: number | null
    notes: string | null
    createdAt: Date | null
  }

  export type InventoryLogCountAggregateOutputType = {
    id: number
    productId: number
    supplierId: number
    change: number
    reason: number
    referenceId: number
    previousStock: number
    newStock: number
    notes: number
    createdAt: number
    _all: number
  }


  export type InventoryLogAvgAggregateInputType = {
    change?: true
    previousStock?: true
    newStock?: true
  }

  export type InventoryLogSumAggregateInputType = {
    change?: true
    previousStock?: true
    newStock?: true
  }

  export type InventoryLogMinAggregateInputType = {
    id?: true
    productId?: true
    supplierId?: true
    change?: true
    reason?: true
    referenceId?: true
    previousStock?: true
    newStock?: true
    notes?: true
    createdAt?: true
  }

  export type InventoryLogMaxAggregateInputType = {
    id?: true
    productId?: true
    supplierId?: true
    change?: true
    reason?: true
    referenceId?: true
    previousStock?: true
    newStock?: true
    notes?: true
    createdAt?: true
  }

  export type InventoryLogCountAggregateInputType = {
    id?: true
    productId?: true
    supplierId?: true
    change?: true
    reason?: true
    referenceId?: true
    previousStock?: true
    newStock?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type InventoryLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryLog to aggregate.
     */
    where?: InventoryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLogs to fetch.
     */
    orderBy?: InventoryLogOrderByWithRelationInput | InventoryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryLogs
    **/
    _count?: true | InventoryLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventoryLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryLogMaxAggregateInputType
  }

  export type GetInventoryLogAggregateType<T extends InventoryLogAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryLog[P]>
      : GetScalarType<T[P], AggregateInventoryLog[P]>
  }




  export type InventoryLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryLogWhereInput
    orderBy?: InventoryLogOrderByWithAggregationInput | InventoryLogOrderByWithAggregationInput[]
    by: InventoryLogScalarFieldEnum[] | InventoryLogScalarFieldEnum
    having?: InventoryLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryLogCountAggregateInputType | true
    _avg?: InventoryLogAvgAggregateInputType
    _sum?: InventoryLogSumAggregateInputType
    _min?: InventoryLogMinAggregateInputType
    _max?: InventoryLogMaxAggregateInputType
  }

  export type InventoryLogGroupByOutputType = {
    id: string
    productId: string
    supplierId: string
    change: number
    reason: string
    referenceId: string | null
    previousStock: number
    newStock: number
    notes: string | null
    createdAt: Date
    _count: InventoryLogCountAggregateOutputType | null
    _avg: InventoryLogAvgAggregateOutputType | null
    _sum: InventoryLogSumAggregateOutputType | null
    _min: InventoryLogMinAggregateOutputType | null
    _max: InventoryLogMaxAggregateOutputType | null
  }

  type GetInventoryLogGroupByPayload<T extends InventoryLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryLogGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryLogGroupByOutputType[P]>
        }
      >
    >


  export type InventoryLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    change?: boolean
    reason?: boolean
    referenceId?: boolean
    previousStock?: boolean
    newStock?: boolean
    notes?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryLog"]>

  export type InventoryLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    change?: boolean
    reason?: boolean
    referenceId?: boolean
    previousStock?: boolean
    newStock?: boolean
    notes?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryLog"]>

  export type InventoryLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    change?: boolean
    reason?: boolean
    referenceId?: boolean
    previousStock?: boolean
    newStock?: boolean
    notes?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryLog"]>

  export type InventoryLogSelectScalar = {
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    change?: boolean
    reason?: boolean
    referenceId?: boolean
    previousStock?: boolean
    newStock?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type InventoryLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "supplierId" | "change" | "reason" | "referenceId" | "previousStock" | "newStock" | "notes" | "createdAt", ExtArgs["result"]["inventoryLog"]>
  export type InventoryLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type InventoryLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type InventoryLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $InventoryLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryLog"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      supplierId: string
      change: number
      reason: string
      referenceId: string | null
      previousStock: number
      newStock: number
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["inventoryLog"]>
    composites: {}
  }

  type InventoryLogGetPayload<S extends boolean | null | undefined | InventoryLogDefaultArgs> = $Result.GetResult<Prisma.$InventoryLogPayload, S>

  type InventoryLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryLogCountAggregateInputType | true
    }

  export interface InventoryLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryLog'], meta: { name: 'InventoryLog' } }
    /**
     * Find zero or one InventoryLog that matches the filter.
     * @param {InventoryLogFindUniqueArgs} args - Arguments to find a InventoryLog
     * @example
     * // Get one InventoryLog
     * const inventoryLog = await prisma.inventoryLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryLogFindUniqueArgs>(args: SelectSubset<T, InventoryLogFindUniqueArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InventoryLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryLogFindUniqueOrThrowArgs} args - Arguments to find a InventoryLog
     * @example
     * // Get one InventoryLog
     * const inventoryLog = await prisma.inventoryLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryLogFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogFindFirstArgs} args - Arguments to find a InventoryLog
     * @example
     * // Get one InventoryLog
     * const inventoryLog = await prisma.inventoryLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryLogFindFirstArgs>(args?: SelectSubset<T, InventoryLogFindFirstArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogFindFirstOrThrowArgs} args - Arguments to find a InventoryLog
     * @example
     * // Get one InventoryLog
     * const inventoryLog = await prisma.inventoryLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryLogFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InventoryLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryLogs
     * const inventoryLogs = await prisma.inventoryLog.findMany()
     * 
     * // Get first 10 InventoryLogs
     * const inventoryLogs = await prisma.inventoryLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryLogWithIdOnly = await prisma.inventoryLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryLogFindManyArgs>(args?: SelectSubset<T, InventoryLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InventoryLog.
     * @param {InventoryLogCreateArgs} args - Arguments to create a InventoryLog.
     * @example
     * // Create one InventoryLog
     * const InventoryLog = await prisma.inventoryLog.create({
     *   data: {
     *     // ... data to create a InventoryLog
     *   }
     * })
     * 
     */
    create<T extends InventoryLogCreateArgs>(args: SelectSubset<T, InventoryLogCreateArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InventoryLogs.
     * @param {InventoryLogCreateManyArgs} args - Arguments to create many InventoryLogs.
     * @example
     * // Create many InventoryLogs
     * const inventoryLog = await prisma.inventoryLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryLogCreateManyArgs>(args?: SelectSubset<T, InventoryLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InventoryLogs and returns the data saved in the database.
     * @param {InventoryLogCreateManyAndReturnArgs} args - Arguments to create many InventoryLogs.
     * @example
     * // Create many InventoryLogs
     * const inventoryLog = await prisma.inventoryLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InventoryLogs and only return the `id`
     * const inventoryLogWithIdOnly = await prisma.inventoryLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryLogCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InventoryLog.
     * @param {InventoryLogDeleteArgs} args - Arguments to delete one InventoryLog.
     * @example
     * // Delete one InventoryLog
     * const InventoryLog = await prisma.inventoryLog.delete({
     *   where: {
     *     // ... filter to delete one InventoryLog
     *   }
     * })
     * 
     */
    delete<T extends InventoryLogDeleteArgs>(args: SelectSubset<T, InventoryLogDeleteArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InventoryLog.
     * @param {InventoryLogUpdateArgs} args - Arguments to update one InventoryLog.
     * @example
     * // Update one InventoryLog
     * const inventoryLog = await prisma.inventoryLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryLogUpdateArgs>(args: SelectSubset<T, InventoryLogUpdateArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InventoryLogs.
     * @param {InventoryLogDeleteManyArgs} args - Arguments to filter InventoryLogs to delete.
     * @example
     * // Delete a few InventoryLogs
     * const { count } = await prisma.inventoryLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryLogDeleteManyArgs>(args?: SelectSubset<T, InventoryLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryLogs
     * const inventoryLog = await prisma.inventoryLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryLogUpdateManyArgs>(args: SelectSubset<T, InventoryLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryLogs and returns the data updated in the database.
     * @param {InventoryLogUpdateManyAndReturnArgs} args - Arguments to update many InventoryLogs.
     * @example
     * // Update many InventoryLogs
     * const inventoryLog = await prisma.inventoryLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InventoryLogs and only return the `id`
     * const inventoryLogWithIdOnly = await prisma.inventoryLog.updateManyAndReturn({
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
    updateManyAndReturn<T extends InventoryLogUpdateManyAndReturnArgs>(args: SelectSubset<T, InventoryLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InventoryLog.
     * @param {InventoryLogUpsertArgs} args - Arguments to update or create a InventoryLog.
     * @example
     * // Update or create a InventoryLog
     * const inventoryLog = await prisma.inventoryLog.upsert({
     *   create: {
     *     // ... data to create a InventoryLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryLog we want to update
     *   }
     * })
     */
    upsert<T extends InventoryLogUpsertArgs>(args: SelectSubset<T, InventoryLogUpsertArgs<ExtArgs>>): Prisma__InventoryLogClient<$Result.GetResult<Prisma.$InventoryLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InventoryLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogCountArgs} args - Arguments to filter InventoryLogs to count.
     * @example
     * // Count the number of InventoryLogs
     * const count = await prisma.inventoryLog.count({
     *   where: {
     *     // ... the filter for the InventoryLogs we want to count
     *   }
     * })
    **/
    count<T extends InventoryLogCountArgs>(
      args?: Subset<T, InventoryLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryLogAggregateArgs>(args: Subset<T, InventoryLogAggregateArgs>): Prisma.PrismaPromise<GetInventoryLogAggregateType<T>>

    /**
     * Group by InventoryLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLogGroupByArgs} args - Group by arguments.
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
      T extends InventoryLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryLogGroupByArgs['orderBy'] }
        : { orderBy?: InventoryLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InventoryLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryLog model
   */
  readonly fields: InventoryLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the InventoryLog model
   */
  interface InventoryLogFieldRefs {
    readonly id: FieldRef<"InventoryLog", 'String'>
    readonly productId: FieldRef<"InventoryLog", 'String'>
    readonly supplierId: FieldRef<"InventoryLog", 'String'>
    readonly change: FieldRef<"InventoryLog", 'Int'>
    readonly reason: FieldRef<"InventoryLog", 'String'>
    readonly referenceId: FieldRef<"InventoryLog", 'String'>
    readonly previousStock: FieldRef<"InventoryLog", 'Int'>
    readonly newStock: FieldRef<"InventoryLog", 'Int'>
    readonly notes: FieldRef<"InventoryLog", 'String'>
    readonly createdAt: FieldRef<"InventoryLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryLog findUnique
   */
  export type InventoryLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLog to fetch.
     */
    where: InventoryLogWhereUniqueInput
  }

  /**
   * InventoryLog findUniqueOrThrow
   */
  export type InventoryLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLog to fetch.
     */
    where: InventoryLogWhereUniqueInput
  }

  /**
   * InventoryLog findFirst
   */
  export type InventoryLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLog to fetch.
     */
    where?: InventoryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLogs to fetch.
     */
    orderBy?: InventoryLogOrderByWithRelationInput | InventoryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryLogs.
     */
    cursor?: InventoryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryLogs.
     */
    distinct?: InventoryLogScalarFieldEnum | InventoryLogScalarFieldEnum[]
  }

  /**
   * InventoryLog findFirstOrThrow
   */
  export type InventoryLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLog to fetch.
     */
    where?: InventoryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLogs to fetch.
     */
    orderBy?: InventoryLogOrderByWithRelationInput | InventoryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryLogs.
     */
    cursor?: InventoryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryLogs.
     */
    distinct?: InventoryLogScalarFieldEnum | InventoryLogScalarFieldEnum[]
  }

  /**
   * InventoryLog findMany
   */
  export type InventoryLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLogs to fetch.
     */
    where?: InventoryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLogs to fetch.
     */
    orderBy?: InventoryLogOrderByWithRelationInput | InventoryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryLogs.
     */
    cursor?: InventoryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLogs.
     */
    skip?: number
    distinct?: InventoryLogScalarFieldEnum | InventoryLogScalarFieldEnum[]
  }

  /**
   * InventoryLog create
   */
  export type InventoryLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * The data needed to create a InventoryLog.
     */
    data: XOR<InventoryLogCreateInput, InventoryLogUncheckedCreateInput>
  }

  /**
   * InventoryLog createMany
   */
  export type InventoryLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryLogs.
     */
    data: InventoryLogCreateManyInput | InventoryLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryLog createManyAndReturn
   */
  export type InventoryLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * The data used to create many InventoryLogs.
     */
    data: InventoryLogCreateManyInput | InventoryLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InventoryLog update
   */
  export type InventoryLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * The data needed to update a InventoryLog.
     */
    data: XOR<InventoryLogUpdateInput, InventoryLogUncheckedUpdateInput>
    /**
     * Choose, which InventoryLog to update.
     */
    where: InventoryLogWhereUniqueInput
  }

  /**
   * InventoryLog updateMany
   */
  export type InventoryLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryLogs.
     */
    data: XOR<InventoryLogUpdateManyMutationInput, InventoryLogUncheckedUpdateManyInput>
    /**
     * Filter which InventoryLogs to update
     */
    where?: InventoryLogWhereInput
    /**
     * Limit how many InventoryLogs to update.
     */
    limit?: number
  }

  /**
   * InventoryLog updateManyAndReturn
   */
  export type InventoryLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * The data used to update InventoryLogs.
     */
    data: XOR<InventoryLogUpdateManyMutationInput, InventoryLogUncheckedUpdateManyInput>
    /**
     * Filter which InventoryLogs to update
     */
    where?: InventoryLogWhereInput
    /**
     * Limit how many InventoryLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InventoryLog upsert
   */
  export type InventoryLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * The filter to search for the InventoryLog to update in case it exists.
     */
    where: InventoryLogWhereUniqueInput
    /**
     * In case the InventoryLog found by the `where` argument doesn't exist, create a new InventoryLog with this data.
     */
    create: XOR<InventoryLogCreateInput, InventoryLogUncheckedCreateInput>
    /**
     * In case the InventoryLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryLogUpdateInput, InventoryLogUncheckedUpdateInput>
  }

  /**
   * InventoryLog delete
   */
  export type InventoryLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
    /**
     * Filter which InventoryLog to delete.
     */
    where: InventoryLogWhereUniqueInput
  }

  /**
   * InventoryLog deleteMany
   */
  export type InventoryLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryLogs to delete
     */
    where?: InventoryLogWhereInput
    /**
     * Limit how many InventoryLogs to delete.
     */
    limit?: number
  }

  /**
   * InventoryLog without action
   */
  export type InventoryLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLog
     */
    select?: InventoryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLog
     */
    omit?: InventoryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLogInclude<ExtArgs> | null
  }


  /**
   * Model SupplierOrder
   */

  export type AggregateSupplierOrder = {
    _count: SupplierOrderCountAggregateOutputType | null
    _avg: SupplierOrderAvgAggregateOutputType | null
    _sum: SupplierOrderSumAggregateOutputType | null
    _min: SupplierOrderMinAggregateOutputType | null
    _max: SupplierOrderMaxAggregateOutputType | null
  }

  export type SupplierOrderAvgAggregateOutputType = {
    totalPaise: number | null
  }

  export type SupplierOrderSumAggregateOutputType = {
    totalPaise: number | null
  }

  export type SupplierOrderMinAggregateOutputType = {
    id: string | null
    orderNumber: string | null
    supplierId: string | null
    farmerId: string | null
    totalPaise: number | null
    paymentStatus: string | null
    orderStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierOrderMaxAggregateOutputType = {
    id: string | null
    orderNumber: string | null
    supplierId: string | null
    farmerId: string | null
    totalPaise: number | null
    paymentStatus: string | null
    orderStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierOrderCountAggregateOutputType = {
    id: number
    orderNumber: number
    supplierId: number
    farmerId: number
    items: number
    totalPaise: number
    paymentStatus: number
    orderStatus: number
    shippingAddress: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SupplierOrderAvgAggregateInputType = {
    totalPaise?: true
  }

  export type SupplierOrderSumAggregateInputType = {
    totalPaise?: true
  }

  export type SupplierOrderMinAggregateInputType = {
    id?: true
    orderNumber?: true
    supplierId?: true
    farmerId?: true
    totalPaise?: true
    paymentStatus?: true
    orderStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierOrderMaxAggregateInputType = {
    id?: true
    orderNumber?: true
    supplierId?: true
    farmerId?: true
    totalPaise?: true
    paymentStatus?: true
    orderStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierOrderCountAggregateInputType = {
    id?: true
    orderNumber?: true
    supplierId?: true
    farmerId?: true
    items?: true
    totalPaise?: true
    paymentStatus?: true
    orderStatus?: true
    shippingAddress?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SupplierOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupplierOrder to aggregate.
     */
    where?: SupplierOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierOrders to fetch.
     */
    orderBy?: SupplierOrderOrderByWithRelationInput | SupplierOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupplierOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SupplierOrders
    **/
    _count?: true | SupplierOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SupplierOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SupplierOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupplierOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupplierOrderMaxAggregateInputType
  }

  export type GetSupplierOrderAggregateType<T extends SupplierOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateSupplierOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupplierOrder[P]>
      : GetScalarType<T[P], AggregateSupplierOrder[P]>
  }




  export type SupplierOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierOrderWhereInput
    orderBy?: SupplierOrderOrderByWithAggregationInput | SupplierOrderOrderByWithAggregationInput[]
    by: SupplierOrderScalarFieldEnum[] | SupplierOrderScalarFieldEnum
    having?: SupplierOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupplierOrderCountAggregateInputType | true
    _avg?: SupplierOrderAvgAggregateInputType
    _sum?: SupplierOrderSumAggregateInputType
    _min?: SupplierOrderMinAggregateInputType
    _max?: SupplierOrderMaxAggregateInputType
  }

  export type SupplierOrderGroupByOutputType = {
    id: string
    orderNumber: string
    supplierId: string
    farmerId: string
    items: JsonValue
    totalPaise: number
    paymentStatus: string
    orderStatus: string
    shippingAddress: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: SupplierOrderCountAggregateOutputType | null
    _avg: SupplierOrderAvgAggregateOutputType | null
    _sum: SupplierOrderSumAggregateOutputType | null
    _min: SupplierOrderMinAggregateOutputType | null
    _max: SupplierOrderMaxAggregateOutputType | null
  }

  type GetSupplierOrderGroupByPayload<T extends SupplierOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupplierOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupplierOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupplierOrderGroupByOutputType[P]>
            : GetScalarType<T[P], SupplierOrderGroupByOutputType[P]>
        }
      >
    >


  export type SupplierOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    supplierId?: boolean
    farmerId?: boolean
    items?: boolean
    totalPaise?: boolean
    paymentStatus?: boolean
    orderStatus?: boolean
    shippingAddress?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supplierOrder"]>

  export type SupplierOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    supplierId?: boolean
    farmerId?: boolean
    items?: boolean
    totalPaise?: boolean
    paymentStatus?: boolean
    orderStatus?: boolean
    shippingAddress?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supplierOrder"]>

  export type SupplierOrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    supplierId?: boolean
    farmerId?: boolean
    items?: boolean
    totalPaise?: boolean
    paymentStatus?: boolean
    orderStatus?: boolean
    shippingAddress?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supplierOrder"]>

  export type SupplierOrderSelectScalar = {
    id?: boolean
    orderNumber?: boolean
    supplierId?: boolean
    farmerId?: boolean
    items?: boolean
    totalPaise?: boolean
    paymentStatus?: boolean
    orderStatus?: boolean
    shippingAddress?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SupplierOrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderNumber" | "supplierId" | "farmerId" | "items" | "totalPaise" | "paymentStatus" | "orderStatus" | "shippingAddress" | "createdAt" | "updatedAt", ExtArgs["result"]["supplierOrder"]>
  export type SupplierOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }
  export type SupplierOrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }
  export type SupplierOrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }

  export type $SupplierOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SupplierOrder"
    objects: {
      supplier: Prisma.$SupplierPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderNumber: string
      supplierId: string
      farmerId: string
      items: Prisma.JsonValue
      totalPaise: number
      paymentStatus: string
      orderStatus: string
      shippingAddress: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["supplierOrder"]>
    composites: {}
  }

  type SupplierOrderGetPayload<S extends boolean | null | undefined | SupplierOrderDefaultArgs> = $Result.GetResult<Prisma.$SupplierOrderPayload, S>

  type SupplierOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SupplierOrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SupplierOrderCountAggregateInputType | true
    }

  export interface SupplierOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SupplierOrder'], meta: { name: 'SupplierOrder' } }
    /**
     * Find zero or one SupplierOrder that matches the filter.
     * @param {SupplierOrderFindUniqueArgs} args - Arguments to find a SupplierOrder
     * @example
     * // Get one SupplierOrder
     * const supplierOrder = await prisma.supplierOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupplierOrderFindUniqueArgs>(args: SelectSubset<T, SupplierOrderFindUniqueArgs<ExtArgs>>): Prisma__SupplierOrderClient<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SupplierOrder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SupplierOrderFindUniqueOrThrowArgs} args - Arguments to find a SupplierOrder
     * @example
     * // Get one SupplierOrder
     * const supplierOrder = await prisma.supplierOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupplierOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, SupplierOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupplierOrderClient<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SupplierOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderFindFirstArgs} args - Arguments to find a SupplierOrder
     * @example
     * // Get one SupplierOrder
     * const supplierOrder = await prisma.supplierOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupplierOrderFindFirstArgs>(args?: SelectSubset<T, SupplierOrderFindFirstArgs<ExtArgs>>): Prisma__SupplierOrderClient<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SupplierOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderFindFirstOrThrowArgs} args - Arguments to find a SupplierOrder
     * @example
     * // Get one SupplierOrder
     * const supplierOrder = await prisma.supplierOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupplierOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, SupplierOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupplierOrderClient<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SupplierOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SupplierOrders
     * const supplierOrders = await prisma.supplierOrder.findMany()
     * 
     * // Get first 10 SupplierOrders
     * const supplierOrders = await prisma.supplierOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const supplierOrderWithIdOnly = await prisma.supplierOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SupplierOrderFindManyArgs>(args?: SelectSubset<T, SupplierOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SupplierOrder.
     * @param {SupplierOrderCreateArgs} args - Arguments to create a SupplierOrder.
     * @example
     * // Create one SupplierOrder
     * const SupplierOrder = await prisma.supplierOrder.create({
     *   data: {
     *     // ... data to create a SupplierOrder
     *   }
     * })
     * 
     */
    create<T extends SupplierOrderCreateArgs>(args: SelectSubset<T, SupplierOrderCreateArgs<ExtArgs>>): Prisma__SupplierOrderClient<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SupplierOrders.
     * @param {SupplierOrderCreateManyArgs} args - Arguments to create many SupplierOrders.
     * @example
     * // Create many SupplierOrders
     * const supplierOrder = await prisma.supplierOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupplierOrderCreateManyArgs>(args?: SelectSubset<T, SupplierOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SupplierOrders and returns the data saved in the database.
     * @param {SupplierOrderCreateManyAndReturnArgs} args - Arguments to create many SupplierOrders.
     * @example
     * // Create many SupplierOrders
     * const supplierOrder = await prisma.supplierOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SupplierOrders and only return the `id`
     * const supplierOrderWithIdOnly = await prisma.supplierOrder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupplierOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, SupplierOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SupplierOrder.
     * @param {SupplierOrderDeleteArgs} args - Arguments to delete one SupplierOrder.
     * @example
     * // Delete one SupplierOrder
     * const SupplierOrder = await prisma.supplierOrder.delete({
     *   where: {
     *     // ... filter to delete one SupplierOrder
     *   }
     * })
     * 
     */
    delete<T extends SupplierOrderDeleteArgs>(args: SelectSubset<T, SupplierOrderDeleteArgs<ExtArgs>>): Prisma__SupplierOrderClient<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SupplierOrder.
     * @param {SupplierOrderUpdateArgs} args - Arguments to update one SupplierOrder.
     * @example
     * // Update one SupplierOrder
     * const supplierOrder = await prisma.supplierOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupplierOrderUpdateArgs>(args: SelectSubset<T, SupplierOrderUpdateArgs<ExtArgs>>): Prisma__SupplierOrderClient<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SupplierOrders.
     * @param {SupplierOrderDeleteManyArgs} args - Arguments to filter SupplierOrders to delete.
     * @example
     * // Delete a few SupplierOrders
     * const { count } = await prisma.supplierOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupplierOrderDeleteManyArgs>(args?: SelectSubset<T, SupplierOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupplierOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SupplierOrders
     * const supplierOrder = await prisma.supplierOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupplierOrderUpdateManyArgs>(args: SelectSubset<T, SupplierOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupplierOrders and returns the data updated in the database.
     * @param {SupplierOrderUpdateManyAndReturnArgs} args - Arguments to update many SupplierOrders.
     * @example
     * // Update many SupplierOrders
     * const supplierOrder = await prisma.supplierOrder.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SupplierOrders and only return the `id`
     * const supplierOrderWithIdOnly = await prisma.supplierOrder.updateManyAndReturn({
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
    updateManyAndReturn<T extends SupplierOrderUpdateManyAndReturnArgs>(args: SelectSubset<T, SupplierOrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SupplierOrder.
     * @param {SupplierOrderUpsertArgs} args - Arguments to update or create a SupplierOrder.
     * @example
     * // Update or create a SupplierOrder
     * const supplierOrder = await prisma.supplierOrder.upsert({
     *   create: {
     *     // ... data to create a SupplierOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SupplierOrder we want to update
     *   }
     * })
     */
    upsert<T extends SupplierOrderUpsertArgs>(args: SelectSubset<T, SupplierOrderUpsertArgs<ExtArgs>>): Prisma__SupplierOrderClient<$Result.GetResult<Prisma.$SupplierOrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SupplierOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderCountArgs} args - Arguments to filter SupplierOrders to count.
     * @example
     * // Count the number of SupplierOrders
     * const count = await prisma.supplierOrder.count({
     *   where: {
     *     // ... the filter for the SupplierOrders we want to count
     *   }
     * })
    **/
    count<T extends SupplierOrderCountArgs>(
      args?: Subset<T, SupplierOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupplierOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SupplierOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SupplierOrderAggregateArgs>(args: Subset<T, SupplierOrderAggregateArgs>): Prisma.PrismaPromise<GetSupplierOrderAggregateType<T>>

    /**
     * Group by SupplierOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderGroupByArgs} args - Group by arguments.
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
      T extends SupplierOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupplierOrderGroupByArgs['orderBy'] }
        : { orderBy?: SupplierOrderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SupplierOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SupplierOrder model
   */
  readonly fields: SupplierOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SupplierOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupplierOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    supplier<T extends SupplierDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SupplierDefaultArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the SupplierOrder model
   */
  interface SupplierOrderFieldRefs {
    readonly id: FieldRef<"SupplierOrder", 'String'>
    readonly orderNumber: FieldRef<"SupplierOrder", 'String'>
    readonly supplierId: FieldRef<"SupplierOrder", 'String'>
    readonly farmerId: FieldRef<"SupplierOrder", 'String'>
    readonly items: FieldRef<"SupplierOrder", 'Json'>
    readonly totalPaise: FieldRef<"SupplierOrder", 'Int'>
    readonly paymentStatus: FieldRef<"SupplierOrder", 'String'>
    readonly orderStatus: FieldRef<"SupplierOrder", 'String'>
    readonly shippingAddress: FieldRef<"SupplierOrder", 'Json'>
    readonly createdAt: FieldRef<"SupplierOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"SupplierOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SupplierOrder findUnique
   */
  export type SupplierOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderInclude<ExtArgs> | null
    /**
     * Filter, which SupplierOrder to fetch.
     */
    where: SupplierOrderWhereUniqueInput
  }

  /**
   * SupplierOrder findUniqueOrThrow
   */
  export type SupplierOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderInclude<ExtArgs> | null
    /**
     * Filter, which SupplierOrder to fetch.
     */
    where: SupplierOrderWhereUniqueInput
  }

  /**
   * SupplierOrder findFirst
   */
  export type SupplierOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderInclude<ExtArgs> | null
    /**
     * Filter, which SupplierOrder to fetch.
     */
    where?: SupplierOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierOrders to fetch.
     */
    orderBy?: SupplierOrderOrderByWithRelationInput | SupplierOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupplierOrders.
     */
    cursor?: SupplierOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupplierOrders.
     */
    distinct?: SupplierOrderScalarFieldEnum | SupplierOrderScalarFieldEnum[]
  }

  /**
   * SupplierOrder findFirstOrThrow
   */
  export type SupplierOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderInclude<ExtArgs> | null
    /**
     * Filter, which SupplierOrder to fetch.
     */
    where?: SupplierOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierOrders to fetch.
     */
    orderBy?: SupplierOrderOrderByWithRelationInput | SupplierOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupplierOrders.
     */
    cursor?: SupplierOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupplierOrders.
     */
    distinct?: SupplierOrderScalarFieldEnum | SupplierOrderScalarFieldEnum[]
  }

  /**
   * SupplierOrder findMany
   */
  export type SupplierOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderInclude<ExtArgs> | null
    /**
     * Filter, which SupplierOrders to fetch.
     */
    where?: SupplierOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierOrders to fetch.
     */
    orderBy?: SupplierOrderOrderByWithRelationInput | SupplierOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SupplierOrders.
     */
    cursor?: SupplierOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierOrders.
     */
    skip?: number
    distinct?: SupplierOrderScalarFieldEnum | SupplierOrderScalarFieldEnum[]
  }

  /**
   * SupplierOrder create
   */
  export type SupplierOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a SupplierOrder.
     */
    data: XOR<SupplierOrderCreateInput, SupplierOrderUncheckedCreateInput>
  }

  /**
   * SupplierOrder createMany
   */
  export type SupplierOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SupplierOrders.
     */
    data: SupplierOrderCreateManyInput | SupplierOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupplierOrder createManyAndReturn
   */
  export type SupplierOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * The data used to create many SupplierOrders.
     */
    data: SupplierOrderCreateManyInput | SupplierOrderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SupplierOrder update
   */
  export type SupplierOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a SupplierOrder.
     */
    data: XOR<SupplierOrderUpdateInput, SupplierOrderUncheckedUpdateInput>
    /**
     * Choose, which SupplierOrder to update.
     */
    where: SupplierOrderWhereUniqueInput
  }

  /**
   * SupplierOrder updateMany
   */
  export type SupplierOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SupplierOrders.
     */
    data: XOR<SupplierOrderUpdateManyMutationInput, SupplierOrderUncheckedUpdateManyInput>
    /**
     * Filter which SupplierOrders to update
     */
    where?: SupplierOrderWhereInput
    /**
     * Limit how many SupplierOrders to update.
     */
    limit?: number
  }

  /**
   * SupplierOrder updateManyAndReturn
   */
  export type SupplierOrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * The data used to update SupplierOrders.
     */
    data: XOR<SupplierOrderUpdateManyMutationInput, SupplierOrderUncheckedUpdateManyInput>
    /**
     * Filter which SupplierOrders to update
     */
    where?: SupplierOrderWhereInput
    /**
     * Limit how many SupplierOrders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SupplierOrder upsert
   */
  export type SupplierOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the SupplierOrder to update in case it exists.
     */
    where: SupplierOrderWhereUniqueInput
    /**
     * In case the SupplierOrder found by the `where` argument doesn't exist, create a new SupplierOrder with this data.
     */
    create: XOR<SupplierOrderCreateInput, SupplierOrderUncheckedCreateInput>
    /**
     * In case the SupplierOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupplierOrderUpdateInput, SupplierOrderUncheckedUpdateInput>
  }

  /**
   * SupplierOrder delete
   */
  export type SupplierOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderInclude<ExtArgs> | null
    /**
     * Filter which SupplierOrder to delete.
     */
    where: SupplierOrderWhereUniqueInput
  }

  /**
   * SupplierOrder deleteMany
   */
  export type SupplierOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupplierOrders to delete
     */
    where?: SupplierOrderWhereInput
    /**
     * Limit how many SupplierOrders to delete.
     */
    limit?: number
  }

  /**
   * SupplierOrder without action
   */
  export type SupplierOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrder
     */
    select?: SupplierOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrder
     */
    omit?: SupplierOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierOrderInclude<ExtArgs> | null
  }


  /**
   * Model DailyAnalytics
   */

  export type AggregateDailyAnalytics = {
    _count: DailyAnalyticsCountAggregateOutputType | null
    _avg: DailyAnalyticsAvgAggregateOutputType | null
    _sum: DailyAnalyticsSumAggregateOutputType | null
    _min: DailyAnalyticsMinAggregateOutputType | null
    _max: DailyAnalyticsMaxAggregateOutputType | null
  }

  export type DailyAnalyticsAvgAggregateOutputType = {
    revenuePaise: number | null
    orderCount: number | null
    unitsSold: number | null
  }

  export type DailyAnalyticsSumAggregateOutputType = {
    revenuePaise: number | null
    orderCount: number | null
    unitsSold: number | null
  }

  export type DailyAnalyticsMinAggregateOutputType = {
    id: string | null
    supplierId: string | null
    date: Date | null
    revenuePaise: number | null
    orderCount: number | null
    unitsSold: number | null
    topProductId: string | null
    createdAt: Date | null
  }

  export type DailyAnalyticsMaxAggregateOutputType = {
    id: string | null
    supplierId: string | null
    date: Date | null
    revenuePaise: number | null
    orderCount: number | null
    unitsSold: number | null
    topProductId: string | null
    createdAt: Date | null
  }

  export type DailyAnalyticsCountAggregateOutputType = {
    id: number
    supplierId: number
    date: number
    revenuePaise: number
    orderCount: number
    unitsSold: number
    topProductId: number
    categoryBreakdown: number
    createdAt: number
    _all: number
  }


  export type DailyAnalyticsAvgAggregateInputType = {
    revenuePaise?: true
    orderCount?: true
    unitsSold?: true
  }

  export type DailyAnalyticsSumAggregateInputType = {
    revenuePaise?: true
    orderCount?: true
    unitsSold?: true
  }

  export type DailyAnalyticsMinAggregateInputType = {
    id?: true
    supplierId?: true
    date?: true
    revenuePaise?: true
    orderCount?: true
    unitsSold?: true
    topProductId?: true
    createdAt?: true
  }

  export type DailyAnalyticsMaxAggregateInputType = {
    id?: true
    supplierId?: true
    date?: true
    revenuePaise?: true
    orderCount?: true
    unitsSold?: true
    topProductId?: true
    createdAt?: true
  }

  export type DailyAnalyticsCountAggregateInputType = {
    id?: true
    supplierId?: true
    date?: true
    revenuePaise?: true
    orderCount?: true
    unitsSold?: true
    topProductId?: true
    categoryBreakdown?: true
    createdAt?: true
    _all?: true
  }

  export type DailyAnalyticsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyAnalytics to aggregate.
     */
    where?: DailyAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyAnalytics to fetch.
     */
    orderBy?: DailyAnalyticsOrderByWithRelationInput | DailyAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DailyAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DailyAnalytics
    **/
    _count?: true | DailyAnalyticsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DailyAnalyticsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DailyAnalyticsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DailyAnalyticsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DailyAnalyticsMaxAggregateInputType
  }

  export type GetDailyAnalyticsAggregateType<T extends DailyAnalyticsAggregateArgs> = {
        [P in keyof T & keyof AggregateDailyAnalytics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDailyAnalytics[P]>
      : GetScalarType<T[P], AggregateDailyAnalytics[P]>
  }




  export type DailyAnalyticsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyAnalyticsWhereInput
    orderBy?: DailyAnalyticsOrderByWithAggregationInput | DailyAnalyticsOrderByWithAggregationInput[]
    by: DailyAnalyticsScalarFieldEnum[] | DailyAnalyticsScalarFieldEnum
    having?: DailyAnalyticsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DailyAnalyticsCountAggregateInputType | true
    _avg?: DailyAnalyticsAvgAggregateInputType
    _sum?: DailyAnalyticsSumAggregateInputType
    _min?: DailyAnalyticsMinAggregateInputType
    _max?: DailyAnalyticsMaxAggregateInputType
  }

  export type DailyAnalyticsGroupByOutputType = {
    id: string
    supplierId: string
    date: Date
    revenuePaise: number
    orderCount: number
    unitsSold: number
    topProductId: string | null
    categoryBreakdown: JsonValue | null
    createdAt: Date
    _count: DailyAnalyticsCountAggregateOutputType | null
    _avg: DailyAnalyticsAvgAggregateOutputType | null
    _sum: DailyAnalyticsSumAggregateOutputType | null
    _min: DailyAnalyticsMinAggregateOutputType | null
    _max: DailyAnalyticsMaxAggregateOutputType | null
  }

  type GetDailyAnalyticsGroupByPayload<T extends DailyAnalyticsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DailyAnalyticsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DailyAnalyticsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DailyAnalyticsGroupByOutputType[P]>
            : GetScalarType<T[P], DailyAnalyticsGroupByOutputType[P]>
        }
      >
    >


  export type DailyAnalyticsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    supplierId?: boolean
    date?: boolean
    revenuePaise?: boolean
    orderCount?: boolean
    unitsSold?: boolean
    topProductId?: boolean
    categoryBreakdown?: boolean
    createdAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyAnalytics"]>

  export type DailyAnalyticsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    supplierId?: boolean
    date?: boolean
    revenuePaise?: boolean
    orderCount?: boolean
    unitsSold?: boolean
    topProductId?: boolean
    categoryBreakdown?: boolean
    createdAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyAnalytics"]>

  export type DailyAnalyticsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    supplierId?: boolean
    date?: boolean
    revenuePaise?: boolean
    orderCount?: boolean
    unitsSold?: boolean
    topProductId?: boolean
    categoryBreakdown?: boolean
    createdAt?: boolean
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyAnalytics"]>

  export type DailyAnalyticsSelectScalar = {
    id?: boolean
    supplierId?: boolean
    date?: boolean
    revenuePaise?: boolean
    orderCount?: boolean
    unitsSold?: boolean
    topProductId?: boolean
    categoryBreakdown?: boolean
    createdAt?: boolean
  }

  export type DailyAnalyticsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "supplierId" | "date" | "revenuePaise" | "orderCount" | "unitsSold" | "topProductId" | "categoryBreakdown" | "createdAt", ExtArgs["result"]["dailyAnalytics"]>
  export type DailyAnalyticsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }
  export type DailyAnalyticsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }
  export type DailyAnalyticsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }

  export type $DailyAnalyticsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DailyAnalytics"
    objects: {
      supplier: Prisma.$SupplierPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      supplierId: string
      date: Date
      revenuePaise: number
      orderCount: number
      unitsSold: number
      topProductId: string | null
      categoryBreakdown: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["dailyAnalytics"]>
    composites: {}
  }

  type DailyAnalyticsGetPayload<S extends boolean | null | undefined | DailyAnalyticsDefaultArgs> = $Result.GetResult<Prisma.$DailyAnalyticsPayload, S>

  type DailyAnalyticsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DailyAnalyticsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DailyAnalyticsCountAggregateInputType | true
    }

  export interface DailyAnalyticsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DailyAnalytics'], meta: { name: 'DailyAnalytics' } }
    /**
     * Find zero or one DailyAnalytics that matches the filter.
     * @param {DailyAnalyticsFindUniqueArgs} args - Arguments to find a DailyAnalytics
     * @example
     * // Get one DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DailyAnalyticsFindUniqueArgs>(args: SelectSubset<T, DailyAnalyticsFindUniqueArgs<ExtArgs>>): Prisma__DailyAnalyticsClient<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DailyAnalytics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DailyAnalyticsFindUniqueOrThrowArgs} args - Arguments to find a DailyAnalytics
     * @example
     * // Get one DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DailyAnalyticsFindUniqueOrThrowArgs>(args: SelectSubset<T, DailyAnalyticsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DailyAnalyticsClient<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyAnalyticsFindFirstArgs} args - Arguments to find a DailyAnalytics
     * @example
     * // Get one DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DailyAnalyticsFindFirstArgs>(args?: SelectSubset<T, DailyAnalyticsFindFirstArgs<ExtArgs>>): Prisma__DailyAnalyticsClient<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyAnalytics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyAnalyticsFindFirstOrThrowArgs} args - Arguments to find a DailyAnalytics
     * @example
     * // Get one DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DailyAnalyticsFindFirstOrThrowArgs>(args?: SelectSubset<T, DailyAnalyticsFindFirstOrThrowArgs<ExtArgs>>): Prisma__DailyAnalyticsClient<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DailyAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyAnalyticsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.findMany()
     * 
     * // Get first 10 DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dailyAnalyticsWithIdOnly = await prisma.dailyAnalytics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DailyAnalyticsFindManyArgs>(args?: SelectSubset<T, DailyAnalyticsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DailyAnalytics.
     * @param {DailyAnalyticsCreateArgs} args - Arguments to create a DailyAnalytics.
     * @example
     * // Create one DailyAnalytics
     * const DailyAnalytics = await prisma.dailyAnalytics.create({
     *   data: {
     *     // ... data to create a DailyAnalytics
     *   }
     * })
     * 
     */
    create<T extends DailyAnalyticsCreateArgs>(args: SelectSubset<T, DailyAnalyticsCreateArgs<ExtArgs>>): Prisma__DailyAnalyticsClient<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DailyAnalytics.
     * @param {DailyAnalyticsCreateManyArgs} args - Arguments to create many DailyAnalytics.
     * @example
     * // Create many DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DailyAnalyticsCreateManyArgs>(args?: SelectSubset<T, DailyAnalyticsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DailyAnalytics and returns the data saved in the database.
     * @param {DailyAnalyticsCreateManyAndReturnArgs} args - Arguments to create many DailyAnalytics.
     * @example
     * // Create many DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DailyAnalytics and only return the `id`
     * const dailyAnalyticsWithIdOnly = await prisma.dailyAnalytics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DailyAnalyticsCreateManyAndReturnArgs>(args?: SelectSubset<T, DailyAnalyticsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DailyAnalytics.
     * @param {DailyAnalyticsDeleteArgs} args - Arguments to delete one DailyAnalytics.
     * @example
     * // Delete one DailyAnalytics
     * const DailyAnalytics = await prisma.dailyAnalytics.delete({
     *   where: {
     *     // ... filter to delete one DailyAnalytics
     *   }
     * })
     * 
     */
    delete<T extends DailyAnalyticsDeleteArgs>(args: SelectSubset<T, DailyAnalyticsDeleteArgs<ExtArgs>>): Prisma__DailyAnalyticsClient<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DailyAnalytics.
     * @param {DailyAnalyticsUpdateArgs} args - Arguments to update one DailyAnalytics.
     * @example
     * // Update one DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DailyAnalyticsUpdateArgs>(args: SelectSubset<T, DailyAnalyticsUpdateArgs<ExtArgs>>): Prisma__DailyAnalyticsClient<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DailyAnalytics.
     * @param {DailyAnalyticsDeleteManyArgs} args - Arguments to filter DailyAnalytics to delete.
     * @example
     * // Delete a few DailyAnalytics
     * const { count } = await prisma.dailyAnalytics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DailyAnalyticsDeleteManyArgs>(args?: SelectSubset<T, DailyAnalyticsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyAnalyticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DailyAnalyticsUpdateManyArgs>(args: SelectSubset<T, DailyAnalyticsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyAnalytics and returns the data updated in the database.
     * @param {DailyAnalyticsUpdateManyAndReturnArgs} args - Arguments to update many DailyAnalytics.
     * @example
     * // Update many DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DailyAnalytics and only return the `id`
     * const dailyAnalyticsWithIdOnly = await prisma.dailyAnalytics.updateManyAndReturn({
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
    updateManyAndReturn<T extends DailyAnalyticsUpdateManyAndReturnArgs>(args: SelectSubset<T, DailyAnalyticsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DailyAnalytics.
     * @param {DailyAnalyticsUpsertArgs} args - Arguments to update or create a DailyAnalytics.
     * @example
     * // Update or create a DailyAnalytics
     * const dailyAnalytics = await prisma.dailyAnalytics.upsert({
     *   create: {
     *     // ... data to create a DailyAnalytics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DailyAnalytics we want to update
     *   }
     * })
     */
    upsert<T extends DailyAnalyticsUpsertArgs>(args: SelectSubset<T, DailyAnalyticsUpsertArgs<ExtArgs>>): Prisma__DailyAnalyticsClient<$Result.GetResult<Prisma.$DailyAnalyticsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DailyAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyAnalyticsCountArgs} args - Arguments to filter DailyAnalytics to count.
     * @example
     * // Count the number of DailyAnalytics
     * const count = await prisma.dailyAnalytics.count({
     *   where: {
     *     // ... the filter for the DailyAnalytics we want to count
     *   }
     * })
    **/
    count<T extends DailyAnalyticsCountArgs>(
      args?: Subset<T, DailyAnalyticsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DailyAnalyticsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DailyAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyAnalyticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DailyAnalyticsAggregateArgs>(args: Subset<T, DailyAnalyticsAggregateArgs>): Prisma.PrismaPromise<GetDailyAnalyticsAggregateType<T>>

    /**
     * Group by DailyAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyAnalyticsGroupByArgs} args - Group by arguments.
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
      T extends DailyAnalyticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DailyAnalyticsGroupByArgs['orderBy'] }
        : { orderBy?: DailyAnalyticsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DailyAnalyticsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailyAnalyticsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DailyAnalytics model
   */
  readonly fields: DailyAnalyticsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DailyAnalytics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DailyAnalyticsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    supplier<T extends SupplierDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SupplierDefaultArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the DailyAnalytics model
   */
  interface DailyAnalyticsFieldRefs {
    readonly id: FieldRef<"DailyAnalytics", 'String'>
    readonly supplierId: FieldRef<"DailyAnalytics", 'String'>
    readonly date: FieldRef<"DailyAnalytics", 'DateTime'>
    readonly revenuePaise: FieldRef<"DailyAnalytics", 'Int'>
    readonly orderCount: FieldRef<"DailyAnalytics", 'Int'>
    readonly unitsSold: FieldRef<"DailyAnalytics", 'Int'>
    readonly topProductId: FieldRef<"DailyAnalytics", 'String'>
    readonly categoryBreakdown: FieldRef<"DailyAnalytics", 'Json'>
    readonly createdAt: FieldRef<"DailyAnalytics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DailyAnalytics findUnique
   */
  export type DailyAnalyticsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which DailyAnalytics to fetch.
     */
    where: DailyAnalyticsWhereUniqueInput
  }

  /**
   * DailyAnalytics findUniqueOrThrow
   */
  export type DailyAnalyticsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which DailyAnalytics to fetch.
     */
    where: DailyAnalyticsWhereUniqueInput
  }

  /**
   * DailyAnalytics findFirst
   */
  export type DailyAnalyticsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which DailyAnalytics to fetch.
     */
    where?: DailyAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyAnalytics to fetch.
     */
    orderBy?: DailyAnalyticsOrderByWithRelationInput | DailyAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyAnalytics.
     */
    cursor?: DailyAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyAnalytics.
     */
    distinct?: DailyAnalyticsScalarFieldEnum | DailyAnalyticsScalarFieldEnum[]
  }

  /**
   * DailyAnalytics findFirstOrThrow
   */
  export type DailyAnalyticsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which DailyAnalytics to fetch.
     */
    where?: DailyAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyAnalytics to fetch.
     */
    orderBy?: DailyAnalyticsOrderByWithRelationInput | DailyAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyAnalytics.
     */
    cursor?: DailyAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyAnalytics.
     */
    distinct?: DailyAnalyticsScalarFieldEnum | DailyAnalyticsScalarFieldEnum[]
  }

  /**
   * DailyAnalytics findMany
   */
  export type DailyAnalyticsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which DailyAnalytics to fetch.
     */
    where?: DailyAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyAnalytics to fetch.
     */
    orderBy?: DailyAnalyticsOrderByWithRelationInput | DailyAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DailyAnalytics.
     */
    cursor?: DailyAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyAnalytics.
     */
    skip?: number
    distinct?: DailyAnalyticsScalarFieldEnum | DailyAnalyticsScalarFieldEnum[]
  }

  /**
   * DailyAnalytics create
   */
  export type DailyAnalyticsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsInclude<ExtArgs> | null
    /**
     * The data needed to create a DailyAnalytics.
     */
    data: XOR<DailyAnalyticsCreateInput, DailyAnalyticsUncheckedCreateInput>
  }

  /**
   * DailyAnalytics createMany
   */
  export type DailyAnalyticsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DailyAnalytics.
     */
    data: DailyAnalyticsCreateManyInput | DailyAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailyAnalytics createManyAndReturn
   */
  export type DailyAnalyticsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to create many DailyAnalytics.
     */
    data: DailyAnalyticsCreateManyInput | DailyAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DailyAnalytics update
   */
  export type DailyAnalyticsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsInclude<ExtArgs> | null
    /**
     * The data needed to update a DailyAnalytics.
     */
    data: XOR<DailyAnalyticsUpdateInput, DailyAnalyticsUncheckedUpdateInput>
    /**
     * Choose, which DailyAnalytics to update.
     */
    where: DailyAnalyticsWhereUniqueInput
  }

  /**
   * DailyAnalytics updateMany
   */
  export type DailyAnalyticsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DailyAnalytics.
     */
    data: XOR<DailyAnalyticsUpdateManyMutationInput, DailyAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which DailyAnalytics to update
     */
    where?: DailyAnalyticsWhereInput
    /**
     * Limit how many DailyAnalytics to update.
     */
    limit?: number
  }

  /**
   * DailyAnalytics updateManyAndReturn
   */
  export type DailyAnalyticsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to update DailyAnalytics.
     */
    data: XOR<DailyAnalyticsUpdateManyMutationInput, DailyAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which DailyAnalytics to update
     */
    where?: DailyAnalyticsWhereInput
    /**
     * Limit how many DailyAnalytics to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DailyAnalytics upsert
   */
  export type DailyAnalyticsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsInclude<ExtArgs> | null
    /**
     * The filter to search for the DailyAnalytics to update in case it exists.
     */
    where: DailyAnalyticsWhereUniqueInput
    /**
     * In case the DailyAnalytics found by the `where` argument doesn't exist, create a new DailyAnalytics with this data.
     */
    create: XOR<DailyAnalyticsCreateInput, DailyAnalyticsUncheckedCreateInput>
    /**
     * In case the DailyAnalytics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DailyAnalyticsUpdateInput, DailyAnalyticsUncheckedUpdateInput>
  }

  /**
   * DailyAnalytics delete
   */
  export type DailyAnalyticsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsInclude<ExtArgs> | null
    /**
     * Filter which DailyAnalytics to delete.
     */
    where: DailyAnalyticsWhereUniqueInput
  }

  /**
   * DailyAnalytics deleteMany
   */
  export type DailyAnalyticsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyAnalytics to delete
     */
    where?: DailyAnalyticsWhereInput
    /**
     * Limit how many DailyAnalytics to delete.
     */
    limit?: number
  }

  /**
   * DailyAnalytics without action
   */
  export type DailyAnalyticsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyAnalytics
     */
    select?: DailyAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyAnalytics
     */
    omit?: DailyAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyAnalyticsInclude<ExtArgs> | null
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


  export const SupplierScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    companyName: 'companyName',
    email: 'email',
    phone: 'phone',
    upiId: 'upiId',
    gstNumber: 'gstNumber',
    avatarUrl: 'avatarUrl',
    address: 'address',
    businessType: 'businessType',
    yearsInOperation: 'yearsInOperation',
    productCategories: 'productCategories',
    businessCertUrl: 'businessCertUrl',
    tradeLicenseUrl: 'tradeLicenseUrl',
    ownerIdProofUrl: 'ownerIdProofUrl',
    gstCertUrl: 'gstCertUrl',
    kycStatus: 'kycStatus',
    kycSubmittedAt: 'kycSubmittedAt',
    kycReviewedAt: 'kycReviewedAt',
    kycReviewedBy: 'kycReviewedBy',
    taxRate: 'taxRate',
    taxInclusive: 'taxInclusive',
    kycRejectionReason: 'kycRejectionReason',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SupplierScalarFieldEnum = (typeof SupplierScalarFieldEnum)[keyof typeof SupplierScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    supplierId: 'supplierId',
    name: 'name',
    slug: 'slug',
    sku: 'sku',
    category: 'category',
    description: 'description',
    price: 'price',
    mrp: 'mrp',
    unit: 'unit',
    stockQuantity: 'stockQuantity',
    reorderThreshold: 'reorderThreshold',
    images: 'images',
    tags: 'tags',
    status: 'status',
    specifications: 'specifications',
    weight: 'weight',
    rating: 'rating',
    reviewCount: 'reviewCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const InventoryLogScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    supplierId: 'supplierId',
    change: 'change',
    reason: 'reason',
    referenceId: 'referenceId',
    previousStock: 'previousStock',
    newStock: 'newStock',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type InventoryLogScalarFieldEnum = (typeof InventoryLogScalarFieldEnum)[keyof typeof InventoryLogScalarFieldEnum]


  export const SupplierOrderScalarFieldEnum: {
    id: 'id',
    orderNumber: 'orderNumber',
    supplierId: 'supplierId',
    farmerId: 'farmerId',
    items: 'items',
    totalPaise: 'totalPaise',
    paymentStatus: 'paymentStatus',
    orderStatus: 'orderStatus',
    shippingAddress: 'shippingAddress',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SupplierOrderScalarFieldEnum = (typeof SupplierOrderScalarFieldEnum)[keyof typeof SupplierOrderScalarFieldEnum]


  export const DailyAnalyticsScalarFieldEnum: {
    id: 'id',
    supplierId: 'supplierId',
    date: 'date',
    revenuePaise: 'revenuePaise',
    orderCount: 'orderCount',
    unitsSold: 'unitsSold',
    topProductId: 'topProductId',
    categoryBreakdown: 'categoryBreakdown',
    createdAt: 'createdAt'
  };

  export type DailyAnalyticsScalarFieldEnum = (typeof DailyAnalyticsScalarFieldEnum)[keyof typeof DailyAnalyticsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'VerificationStatus'
   */
  export type EnumVerificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationStatus'>
    


  /**
   * Reference to a field of type 'VerificationStatus[]'
   */
  export type ListEnumVerificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


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


  export type SupplierWhereInput = {
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    id?: StringFilter<"Supplier"> | string
    userId?: StringFilter<"Supplier"> | string
    companyName?: StringFilter<"Supplier"> | string
    email?: StringFilter<"Supplier"> | string
    phone?: StringFilter<"Supplier"> | string
    upiId?: StringNullableFilter<"Supplier"> | string | null
    gstNumber?: StringNullableFilter<"Supplier"> | string | null
    avatarUrl?: StringNullableFilter<"Supplier"> | string | null
    address?: JsonFilter<"Supplier">
    businessType?: StringNullableFilter<"Supplier"> | string | null
    yearsInOperation?: StringNullableFilter<"Supplier"> | string | null
    productCategories?: StringNullableListFilter<"Supplier">
    businessCertUrl?: StringNullableFilter<"Supplier"> | string | null
    tradeLicenseUrl?: StringNullableFilter<"Supplier"> | string | null
    ownerIdProofUrl?: StringNullableFilter<"Supplier"> | string | null
    gstCertUrl?: StringNullableFilter<"Supplier"> | string | null
    kycStatus?: EnumVerificationStatusFilter<"Supplier"> | $Enums.VerificationStatus
    kycSubmittedAt?: DateTimeNullableFilter<"Supplier"> | Date | string | null
    kycReviewedAt?: DateTimeNullableFilter<"Supplier"> | Date | string | null
    kycReviewedBy?: StringNullableFilter<"Supplier"> | string | null
    taxRate?: FloatNullableFilter<"Supplier"> | number | null
    taxInclusive?: BoolFilter<"Supplier"> | boolean
    kycRejectionReason?: StringNullableFilter<"Supplier"> | string | null
    isActive?: BoolFilter<"Supplier"> | boolean
    createdAt?: DateTimeFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeFilter<"Supplier"> | Date | string
    products?: ProductListRelationFilter
    orders?: SupplierOrderListRelationFilter
    analytics?: DailyAnalyticsListRelationFilter
  }

  export type SupplierOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    companyName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    upiId?: SortOrderInput | SortOrder
    gstNumber?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    address?: SortOrder
    businessType?: SortOrderInput | SortOrder
    yearsInOperation?: SortOrderInput | SortOrder
    productCategories?: SortOrder
    businessCertUrl?: SortOrderInput | SortOrder
    tradeLicenseUrl?: SortOrderInput | SortOrder
    ownerIdProofUrl?: SortOrderInput | SortOrder
    gstCertUrl?: SortOrderInput | SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrderInput | SortOrder
    kycReviewedAt?: SortOrderInput | SortOrder
    kycReviewedBy?: SortOrderInput | SortOrder
    taxRate?: SortOrderInput | SortOrder
    taxInclusive?: SortOrder
    kycRejectionReason?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    products?: ProductOrderByRelationAggregateInput
    orders?: SupplierOrderOrderByRelationAggregateInput
    analytics?: DailyAnalyticsOrderByRelationAggregateInput
  }

  export type SupplierWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    email?: string
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    companyName?: StringFilter<"Supplier"> | string
    phone?: StringFilter<"Supplier"> | string
    upiId?: StringNullableFilter<"Supplier"> | string | null
    gstNumber?: StringNullableFilter<"Supplier"> | string | null
    avatarUrl?: StringNullableFilter<"Supplier"> | string | null
    address?: JsonFilter<"Supplier">
    businessType?: StringNullableFilter<"Supplier"> | string | null
    yearsInOperation?: StringNullableFilter<"Supplier"> | string | null
    productCategories?: StringNullableListFilter<"Supplier">
    businessCertUrl?: StringNullableFilter<"Supplier"> | string | null
    tradeLicenseUrl?: StringNullableFilter<"Supplier"> | string | null
    ownerIdProofUrl?: StringNullableFilter<"Supplier"> | string | null
    gstCertUrl?: StringNullableFilter<"Supplier"> | string | null
    kycStatus?: EnumVerificationStatusFilter<"Supplier"> | $Enums.VerificationStatus
    kycSubmittedAt?: DateTimeNullableFilter<"Supplier"> | Date | string | null
    kycReviewedAt?: DateTimeNullableFilter<"Supplier"> | Date | string | null
    kycReviewedBy?: StringNullableFilter<"Supplier"> | string | null
    taxRate?: FloatNullableFilter<"Supplier"> | number | null
    taxInclusive?: BoolFilter<"Supplier"> | boolean
    kycRejectionReason?: StringNullableFilter<"Supplier"> | string | null
    isActive?: BoolFilter<"Supplier"> | boolean
    createdAt?: DateTimeFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeFilter<"Supplier"> | Date | string
    products?: ProductListRelationFilter
    orders?: SupplierOrderListRelationFilter
    analytics?: DailyAnalyticsListRelationFilter
  }, "id" | "userId" | "email">

  export type SupplierOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    companyName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    upiId?: SortOrderInput | SortOrder
    gstNumber?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    address?: SortOrder
    businessType?: SortOrderInput | SortOrder
    yearsInOperation?: SortOrderInput | SortOrder
    productCategories?: SortOrder
    businessCertUrl?: SortOrderInput | SortOrder
    tradeLicenseUrl?: SortOrderInput | SortOrder
    ownerIdProofUrl?: SortOrderInput | SortOrder
    gstCertUrl?: SortOrderInput | SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrderInput | SortOrder
    kycReviewedAt?: SortOrderInput | SortOrder
    kycReviewedBy?: SortOrderInput | SortOrder
    taxRate?: SortOrderInput | SortOrder
    taxInclusive?: SortOrder
    kycRejectionReason?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SupplierCountOrderByAggregateInput
    _avg?: SupplierAvgOrderByAggregateInput
    _max?: SupplierMaxOrderByAggregateInput
    _min?: SupplierMinOrderByAggregateInput
    _sum?: SupplierSumOrderByAggregateInput
  }

  export type SupplierScalarWhereWithAggregatesInput = {
    AND?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    OR?: SupplierScalarWhereWithAggregatesInput[]
    NOT?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Supplier"> | string
    userId?: StringWithAggregatesFilter<"Supplier"> | string
    companyName?: StringWithAggregatesFilter<"Supplier"> | string
    email?: StringWithAggregatesFilter<"Supplier"> | string
    phone?: StringWithAggregatesFilter<"Supplier"> | string
    upiId?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    gstNumber?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    address?: JsonWithAggregatesFilter<"Supplier">
    businessType?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    yearsInOperation?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    productCategories?: StringNullableListFilter<"Supplier">
    businessCertUrl?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    tradeLicenseUrl?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    ownerIdProofUrl?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    gstCertUrl?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    kycStatus?: EnumVerificationStatusWithAggregatesFilter<"Supplier"> | $Enums.VerificationStatus
    kycSubmittedAt?: DateTimeNullableWithAggregatesFilter<"Supplier"> | Date | string | null
    kycReviewedAt?: DateTimeNullableWithAggregatesFilter<"Supplier"> | Date | string | null
    kycReviewedBy?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    taxRate?: FloatNullableWithAggregatesFilter<"Supplier"> | number | null
    taxInclusive?: BoolWithAggregatesFilter<"Supplier"> | boolean
    kycRejectionReason?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    isActive?: BoolWithAggregatesFilter<"Supplier"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Supplier"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    supplierId?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    slug?: StringFilter<"Product"> | string
    sku?: StringFilter<"Product"> | string
    category?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    price?: IntFilter<"Product"> | number
    mrp?: IntFilter<"Product"> | number
    unit?: StringFilter<"Product"> | string
    stockQuantity?: IntFilter<"Product"> | number
    reorderThreshold?: IntFilter<"Product"> | number
    images?: StringNullableListFilter<"Product">
    tags?: StringNullableListFilter<"Product">
    status?: StringFilter<"Product"> | string
    specifications?: JsonNullableFilter<"Product">
    weight?: FloatNullableFilter<"Product"> | number | null
    rating?: FloatNullableFilter<"Product"> | number | null
    reviewCount?: IntFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    supplier?: XOR<SupplierScalarRelationFilter, SupplierWhereInput>
    inventoryLogs?: InventoryLogListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    supplierId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    description?: SortOrder
    price?: SortOrder
    mrp?: SortOrder
    unit?: SortOrder
    stockQuantity?: SortOrder
    reorderThreshold?: SortOrder
    images?: SortOrder
    tags?: SortOrder
    status?: SortOrder
    specifications?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    rating?: SortOrderInput | SortOrder
    reviewCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    supplier?: SupplierOrderByWithRelationInput
    inventoryLogs?: InventoryLogOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    sku?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    supplierId?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    category?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    price?: IntFilter<"Product"> | number
    mrp?: IntFilter<"Product"> | number
    unit?: StringFilter<"Product"> | string
    stockQuantity?: IntFilter<"Product"> | number
    reorderThreshold?: IntFilter<"Product"> | number
    images?: StringNullableListFilter<"Product">
    tags?: StringNullableListFilter<"Product">
    status?: StringFilter<"Product"> | string
    specifications?: JsonNullableFilter<"Product">
    weight?: FloatNullableFilter<"Product"> | number | null
    rating?: FloatNullableFilter<"Product"> | number | null
    reviewCount?: IntFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    supplier?: XOR<SupplierScalarRelationFilter, SupplierWhereInput>
    inventoryLogs?: InventoryLogListRelationFilter
  }, "id" | "slug" | "sku">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    supplierId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    description?: SortOrder
    price?: SortOrder
    mrp?: SortOrder
    unit?: SortOrder
    stockQuantity?: SortOrder
    reorderThreshold?: SortOrder
    images?: SortOrder
    tags?: SortOrder
    status?: SortOrder
    specifications?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    rating?: SortOrderInput | SortOrder
    reviewCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    supplierId?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    slug?: StringWithAggregatesFilter<"Product"> | string
    sku?: StringWithAggregatesFilter<"Product"> | string
    category?: StringWithAggregatesFilter<"Product"> | string
    description?: StringWithAggregatesFilter<"Product"> | string
    price?: IntWithAggregatesFilter<"Product"> | number
    mrp?: IntWithAggregatesFilter<"Product"> | number
    unit?: StringWithAggregatesFilter<"Product"> | string
    stockQuantity?: IntWithAggregatesFilter<"Product"> | number
    reorderThreshold?: IntWithAggregatesFilter<"Product"> | number
    images?: StringNullableListFilter<"Product">
    tags?: StringNullableListFilter<"Product">
    status?: StringWithAggregatesFilter<"Product"> | string
    specifications?: JsonNullableWithAggregatesFilter<"Product">
    weight?: FloatNullableWithAggregatesFilter<"Product"> | number | null
    rating?: FloatNullableWithAggregatesFilter<"Product"> | number | null
    reviewCount?: IntWithAggregatesFilter<"Product"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type InventoryLogWhereInput = {
    AND?: InventoryLogWhereInput | InventoryLogWhereInput[]
    OR?: InventoryLogWhereInput[]
    NOT?: InventoryLogWhereInput | InventoryLogWhereInput[]
    id?: StringFilter<"InventoryLog"> | string
    productId?: StringFilter<"InventoryLog"> | string
    supplierId?: StringFilter<"InventoryLog"> | string
    change?: IntFilter<"InventoryLog"> | number
    reason?: StringFilter<"InventoryLog"> | string
    referenceId?: StringNullableFilter<"InventoryLog"> | string | null
    previousStock?: IntFilter<"InventoryLog"> | number
    newStock?: IntFilter<"InventoryLog"> | number
    notes?: StringNullableFilter<"InventoryLog"> | string | null
    createdAt?: DateTimeFilter<"InventoryLog"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type InventoryLogOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    change?: SortOrder
    reason?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type InventoryLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InventoryLogWhereInput | InventoryLogWhereInput[]
    OR?: InventoryLogWhereInput[]
    NOT?: InventoryLogWhereInput | InventoryLogWhereInput[]
    productId?: StringFilter<"InventoryLog"> | string
    supplierId?: StringFilter<"InventoryLog"> | string
    change?: IntFilter<"InventoryLog"> | number
    reason?: StringFilter<"InventoryLog"> | string
    referenceId?: StringNullableFilter<"InventoryLog"> | string | null
    previousStock?: IntFilter<"InventoryLog"> | number
    newStock?: IntFilter<"InventoryLog"> | number
    notes?: StringNullableFilter<"InventoryLog"> | string | null
    createdAt?: DateTimeFilter<"InventoryLog"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type InventoryLogOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    change?: SortOrder
    reason?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InventoryLogCountOrderByAggregateInput
    _avg?: InventoryLogAvgOrderByAggregateInput
    _max?: InventoryLogMaxOrderByAggregateInput
    _min?: InventoryLogMinOrderByAggregateInput
    _sum?: InventoryLogSumOrderByAggregateInput
  }

  export type InventoryLogScalarWhereWithAggregatesInput = {
    AND?: InventoryLogScalarWhereWithAggregatesInput | InventoryLogScalarWhereWithAggregatesInput[]
    OR?: InventoryLogScalarWhereWithAggregatesInput[]
    NOT?: InventoryLogScalarWhereWithAggregatesInput | InventoryLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InventoryLog"> | string
    productId?: StringWithAggregatesFilter<"InventoryLog"> | string
    supplierId?: StringWithAggregatesFilter<"InventoryLog"> | string
    change?: IntWithAggregatesFilter<"InventoryLog"> | number
    reason?: StringWithAggregatesFilter<"InventoryLog"> | string
    referenceId?: StringNullableWithAggregatesFilter<"InventoryLog"> | string | null
    previousStock?: IntWithAggregatesFilter<"InventoryLog"> | number
    newStock?: IntWithAggregatesFilter<"InventoryLog"> | number
    notes?: StringNullableWithAggregatesFilter<"InventoryLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InventoryLog"> | Date | string
  }

  export type SupplierOrderWhereInput = {
    AND?: SupplierOrderWhereInput | SupplierOrderWhereInput[]
    OR?: SupplierOrderWhereInput[]
    NOT?: SupplierOrderWhereInput | SupplierOrderWhereInput[]
    id?: StringFilter<"SupplierOrder"> | string
    orderNumber?: StringFilter<"SupplierOrder"> | string
    supplierId?: StringFilter<"SupplierOrder"> | string
    farmerId?: StringFilter<"SupplierOrder"> | string
    items?: JsonFilter<"SupplierOrder">
    totalPaise?: IntFilter<"SupplierOrder"> | number
    paymentStatus?: StringFilter<"SupplierOrder"> | string
    orderStatus?: StringFilter<"SupplierOrder"> | string
    shippingAddress?: JsonNullableFilter<"SupplierOrder">
    createdAt?: DateTimeFilter<"SupplierOrder"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierOrder"> | Date | string
    supplier?: XOR<SupplierScalarRelationFilter, SupplierWhereInput>
  }

  export type SupplierOrderOrderByWithRelationInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    supplierId?: SortOrder
    farmerId?: SortOrder
    items?: SortOrder
    totalPaise?: SortOrder
    paymentStatus?: SortOrder
    orderStatus?: SortOrder
    shippingAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    supplier?: SupplierOrderByWithRelationInput
  }

  export type SupplierOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderNumber?: string
    AND?: SupplierOrderWhereInput | SupplierOrderWhereInput[]
    OR?: SupplierOrderWhereInput[]
    NOT?: SupplierOrderWhereInput | SupplierOrderWhereInput[]
    supplierId?: StringFilter<"SupplierOrder"> | string
    farmerId?: StringFilter<"SupplierOrder"> | string
    items?: JsonFilter<"SupplierOrder">
    totalPaise?: IntFilter<"SupplierOrder"> | number
    paymentStatus?: StringFilter<"SupplierOrder"> | string
    orderStatus?: StringFilter<"SupplierOrder"> | string
    shippingAddress?: JsonNullableFilter<"SupplierOrder">
    createdAt?: DateTimeFilter<"SupplierOrder"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierOrder"> | Date | string
    supplier?: XOR<SupplierScalarRelationFilter, SupplierWhereInput>
  }, "id" | "orderNumber">

  export type SupplierOrderOrderByWithAggregationInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    supplierId?: SortOrder
    farmerId?: SortOrder
    items?: SortOrder
    totalPaise?: SortOrder
    paymentStatus?: SortOrder
    orderStatus?: SortOrder
    shippingAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SupplierOrderCountOrderByAggregateInput
    _avg?: SupplierOrderAvgOrderByAggregateInput
    _max?: SupplierOrderMaxOrderByAggregateInput
    _min?: SupplierOrderMinOrderByAggregateInput
    _sum?: SupplierOrderSumOrderByAggregateInput
  }

  export type SupplierOrderScalarWhereWithAggregatesInput = {
    AND?: SupplierOrderScalarWhereWithAggregatesInput | SupplierOrderScalarWhereWithAggregatesInput[]
    OR?: SupplierOrderScalarWhereWithAggregatesInput[]
    NOT?: SupplierOrderScalarWhereWithAggregatesInput | SupplierOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SupplierOrder"> | string
    orderNumber?: StringWithAggregatesFilter<"SupplierOrder"> | string
    supplierId?: StringWithAggregatesFilter<"SupplierOrder"> | string
    farmerId?: StringWithAggregatesFilter<"SupplierOrder"> | string
    items?: JsonWithAggregatesFilter<"SupplierOrder">
    totalPaise?: IntWithAggregatesFilter<"SupplierOrder"> | number
    paymentStatus?: StringWithAggregatesFilter<"SupplierOrder"> | string
    orderStatus?: StringWithAggregatesFilter<"SupplierOrder"> | string
    shippingAddress?: JsonNullableWithAggregatesFilter<"SupplierOrder">
    createdAt?: DateTimeWithAggregatesFilter<"SupplierOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SupplierOrder"> | Date | string
  }

  export type DailyAnalyticsWhereInput = {
    AND?: DailyAnalyticsWhereInput | DailyAnalyticsWhereInput[]
    OR?: DailyAnalyticsWhereInput[]
    NOT?: DailyAnalyticsWhereInput | DailyAnalyticsWhereInput[]
    id?: StringFilter<"DailyAnalytics"> | string
    supplierId?: StringFilter<"DailyAnalytics"> | string
    date?: DateTimeFilter<"DailyAnalytics"> | Date | string
    revenuePaise?: IntFilter<"DailyAnalytics"> | number
    orderCount?: IntFilter<"DailyAnalytics"> | number
    unitsSold?: IntFilter<"DailyAnalytics"> | number
    topProductId?: StringNullableFilter<"DailyAnalytics"> | string | null
    categoryBreakdown?: JsonNullableFilter<"DailyAnalytics">
    createdAt?: DateTimeFilter<"DailyAnalytics"> | Date | string
    supplier?: XOR<SupplierScalarRelationFilter, SupplierWhereInput>
  }

  export type DailyAnalyticsOrderByWithRelationInput = {
    id?: SortOrder
    supplierId?: SortOrder
    date?: SortOrder
    revenuePaise?: SortOrder
    orderCount?: SortOrder
    unitsSold?: SortOrder
    topProductId?: SortOrderInput | SortOrder
    categoryBreakdown?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    supplier?: SupplierOrderByWithRelationInput
  }

  export type DailyAnalyticsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    supplierId_date?: DailyAnalyticsSupplierIdDateCompoundUniqueInput
    AND?: DailyAnalyticsWhereInput | DailyAnalyticsWhereInput[]
    OR?: DailyAnalyticsWhereInput[]
    NOT?: DailyAnalyticsWhereInput | DailyAnalyticsWhereInput[]
    supplierId?: StringFilter<"DailyAnalytics"> | string
    date?: DateTimeFilter<"DailyAnalytics"> | Date | string
    revenuePaise?: IntFilter<"DailyAnalytics"> | number
    orderCount?: IntFilter<"DailyAnalytics"> | number
    unitsSold?: IntFilter<"DailyAnalytics"> | number
    topProductId?: StringNullableFilter<"DailyAnalytics"> | string | null
    categoryBreakdown?: JsonNullableFilter<"DailyAnalytics">
    createdAt?: DateTimeFilter<"DailyAnalytics"> | Date | string
    supplier?: XOR<SupplierScalarRelationFilter, SupplierWhereInput>
  }, "id" | "supplierId_date">

  export type DailyAnalyticsOrderByWithAggregationInput = {
    id?: SortOrder
    supplierId?: SortOrder
    date?: SortOrder
    revenuePaise?: SortOrder
    orderCount?: SortOrder
    unitsSold?: SortOrder
    topProductId?: SortOrderInput | SortOrder
    categoryBreakdown?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DailyAnalyticsCountOrderByAggregateInput
    _avg?: DailyAnalyticsAvgOrderByAggregateInput
    _max?: DailyAnalyticsMaxOrderByAggregateInput
    _min?: DailyAnalyticsMinOrderByAggregateInput
    _sum?: DailyAnalyticsSumOrderByAggregateInput
  }

  export type DailyAnalyticsScalarWhereWithAggregatesInput = {
    AND?: DailyAnalyticsScalarWhereWithAggregatesInput | DailyAnalyticsScalarWhereWithAggregatesInput[]
    OR?: DailyAnalyticsScalarWhereWithAggregatesInput[]
    NOT?: DailyAnalyticsScalarWhereWithAggregatesInput | DailyAnalyticsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DailyAnalytics"> | string
    supplierId?: StringWithAggregatesFilter<"DailyAnalytics"> | string
    date?: DateTimeWithAggregatesFilter<"DailyAnalytics"> | Date | string
    revenuePaise?: IntWithAggregatesFilter<"DailyAnalytics"> | number
    orderCount?: IntWithAggregatesFilter<"DailyAnalytics"> | number
    unitsSold?: IntWithAggregatesFilter<"DailyAnalytics"> | number
    topProductId?: StringNullableWithAggregatesFilter<"DailyAnalytics"> | string | null
    categoryBreakdown?: JsonNullableWithAggregatesFilter<"DailyAnalytics">
    createdAt?: DateTimeWithAggregatesFilter<"DailyAnalytics"> | Date | string
  }

  export type SupplierCreateInput = {
    id?: string
    userId: string
    companyName: string
    email: string
    phone: string
    upiId?: string | null
    gstNumber?: string | null
    avatarUrl?: string | null
    address: JsonNullValueInput | InputJsonValue
    businessType?: string | null
    yearsInOperation?: string | null
    productCategories?: SupplierCreateproductCategoriesInput | string[]
    businessCertUrl?: string | null
    tradeLicenseUrl?: string | null
    ownerIdProofUrl?: string | null
    gstCertUrl?: string | null
    kycStatus?: $Enums.VerificationStatus
    kycSubmittedAt?: Date | string | null
    kycReviewedAt?: Date | string | null
    kycReviewedBy?: string | null
    taxRate?: number | null
    taxInclusive?: boolean
    kycRejectionReason?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductCreateNestedManyWithoutSupplierInput
    orders?: SupplierOrderCreateNestedManyWithoutSupplierInput
    analytics?: DailyAnalyticsCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUncheckedCreateInput = {
    id?: string
    userId: string
    companyName: string
    email: string
    phone: string
    upiId?: string | null
    gstNumber?: string | null
    avatarUrl?: string | null
    address: JsonNullValueInput | InputJsonValue
    businessType?: string | null
    yearsInOperation?: string | null
    productCategories?: SupplierCreateproductCategoriesInput | string[]
    businessCertUrl?: string | null
    tradeLicenseUrl?: string | null
    ownerIdProofUrl?: string | null
    gstCertUrl?: string | null
    kycStatus?: $Enums.VerificationStatus
    kycSubmittedAt?: Date | string | null
    kycReviewedAt?: Date | string | null
    kycReviewedBy?: string | null
    taxRate?: number | null
    taxInclusive?: boolean
    kycRejectionReason?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductUncheckedCreateNestedManyWithoutSupplierInput
    orders?: SupplierOrderUncheckedCreateNestedManyWithoutSupplierInput
    analytics?: DailyAnalyticsUncheckedCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    upiId?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    yearsInOperation?: NullableStringFieldUpdateOperationsInput | string | null
    productCategories?: SupplierUpdateproductCategoriesInput | string[]
    businessCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tradeLicenseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerIdProofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gstCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    taxInclusive?: BoolFieldUpdateOperationsInput | boolean
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUpdateManyWithoutSupplierNestedInput
    orders?: SupplierOrderUpdateManyWithoutSupplierNestedInput
    analytics?: DailyAnalyticsUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    upiId?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    yearsInOperation?: NullableStringFieldUpdateOperationsInput | string | null
    productCategories?: SupplierUpdateproductCategoriesInput | string[]
    businessCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tradeLicenseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerIdProofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gstCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    taxInclusive?: BoolFieldUpdateOperationsInput | boolean
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUncheckedUpdateManyWithoutSupplierNestedInput
    orders?: SupplierOrderUncheckedUpdateManyWithoutSupplierNestedInput
    analytics?: DailyAnalyticsUncheckedUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierCreateManyInput = {
    id?: string
    userId: string
    companyName: string
    email: string
    phone: string
    upiId?: string | null
    gstNumber?: string | null
    avatarUrl?: string | null
    address: JsonNullValueInput | InputJsonValue
    businessType?: string | null
    yearsInOperation?: string | null
    productCategories?: SupplierCreateproductCategoriesInput | string[]
    businessCertUrl?: string | null
    tradeLicenseUrl?: string | null
    ownerIdProofUrl?: string | null
    gstCertUrl?: string | null
    kycStatus?: $Enums.VerificationStatus
    kycSubmittedAt?: Date | string | null
    kycReviewedAt?: Date | string | null
    kycReviewedBy?: string | null
    taxRate?: number | null
    taxInclusive?: boolean
    kycRejectionReason?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    upiId?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    yearsInOperation?: NullableStringFieldUpdateOperationsInput | string | null
    productCategories?: SupplierUpdateproductCategoriesInput | string[]
    businessCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tradeLicenseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerIdProofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gstCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    taxInclusive?: BoolFieldUpdateOperationsInput | boolean
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    upiId?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    yearsInOperation?: NullableStringFieldUpdateOperationsInput | string | null
    productCategories?: SupplierUpdateproductCategoriesInput | string[]
    businessCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tradeLicenseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerIdProofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gstCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    taxInclusive?: BoolFieldUpdateOperationsInput | boolean
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id?: string
    name: string
    slug: string
    sku: string
    category: string
    description: string
    price: number
    mrp: number
    unit: string
    stockQuantity?: number
    reorderThreshold?: number
    images?: ProductCreateimagesInput | string[]
    tags?: ProductCreatetagsInput | string[]
    status?: string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: number | null
    rating?: number | null
    reviewCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    supplier: SupplierCreateNestedOneWithoutProductsInput
    inventoryLogs?: InventoryLogCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    supplierId: string
    name: string
    slug: string
    sku: string
    category: string
    description: string
    price: number
    mrp: number
    unit: string
    stockQuantity?: number
    reorderThreshold?: number
    images?: ProductCreateimagesInput | string[]
    tags?: ProductCreatetagsInput | string[]
    status?: string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: number | null
    rating?: number | null
    reviewCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    inventoryLogs?: InventoryLogUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    mrp?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    stockQuantity?: IntFieldUpdateOperationsInput | number
    reorderThreshold?: IntFieldUpdateOperationsInput | number
    images?: ProductUpdateimagesInput | string[]
    tags?: ProductUpdatetagsInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    reviewCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneRequiredWithoutProductsNestedInput
    inventoryLogs?: InventoryLogUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    mrp?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    stockQuantity?: IntFieldUpdateOperationsInput | number
    reorderThreshold?: IntFieldUpdateOperationsInput | number
    images?: ProductUpdateimagesInput | string[]
    tags?: ProductUpdatetagsInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    reviewCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryLogs?: InventoryLogUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: string
    supplierId: string
    name: string
    slug: string
    sku: string
    category: string
    description: string
    price: number
    mrp: number
    unit: string
    stockQuantity?: number
    reorderThreshold?: number
    images?: ProductCreateimagesInput | string[]
    tags?: ProductCreatetagsInput | string[]
    status?: string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: number | null
    rating?: number | null
    reviewCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    mrp?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    stockQuantity?: IntFieldUpdateOperationsInput | number
    reorderThreshold?: IntFieldUpdateOperationsInput | number
    images?: ProductUpdateimagesInput | string[]
    tags?: ProductUpdatetagsInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    reviewCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    mrp?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    stockQuantity?: IntFieldUpdateOperationsInput | number
    reorderThreshold?: IntFieldUpdateOperationsInput | number
    images?: ProductUpdateimagesInput | string[]
    tags?: ProductUpdatetagsInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    reviewCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryLogCreateInput = {
    id?: string
    supplierId: string
    change: number
    reason: string
    referenceId?: string | null
    previousStock: number
    newStock: number
    notes?: string | null
    createdAt?: Date | string
    product: ProductCreateNestedOneWithoutInventoryLogsInput
  }

  export type InventoryLogUncheckedCreateInput = {
    id?: string
    productId: string
    supplierId: string
    change: number
    reason: string
    referenceId?: string | null
    previousStock: number
    newStock: number
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    change?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutInventoryLogsNestedInput
  }

  export type InventoryLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    change?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryLogCreateManyInput = {
    id?: string
    productId: string
    supplierId: string
    change: number
    reason: string
    referenceId?: string | null
    previousStock: number
    newStock: number
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    change?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    change?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierOrderCreateInput = {
    id?: string
    orderNumber: string
    farmerId: string
    items: JsonNullValueInput | InputJsonValue
    totalPaise: number
    paymentStatus?: string
    orderStatus?: string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    supplier: SupplierCreateNestedOneWithoutOrdersInput
  }

  export type SupplierOrderUncheckedCreateInput = {
    id?: string
    orderNumber: string
    supplierId: string
    farmerId: string
    items: JsonNullValueInput | InputJsonValue
    totalPaise: number
    paymentStatus?: string
    orderStatus?: string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalPaise?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type SupplierOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalPaise?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierOrderCreateManyInput = {
    id?: string
    orderNumber: string
    supplierId: string
    farmerId: string
    items: JsonNullValueInput | InputJsonValue
    totalPaise: number
    paymentStatus?: string
    orderStatus?: string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalPaise?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalPaise?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyAnalyticsCreateInput = {
    id?: string
    date: Date | string
    revenuePaise?: number
    orderCount?: number
    unitsSold?: number
    topProductId?: string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    supplier: SupplierCreateNestedOneWithoutAnalyticsInput
  }

  export type DailyAnalyticsUncheckedCreateInput = {
    id?: string
    supplierId: string
    date: Date | string
    revenuePaise?: number
    orderCount?: number
    unitsSold?: number
    topProductId?: string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type DailyAnalyticsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    revenuePaise?: IntFieldUpdateOperationsInput | number
    orderCount?: IntFieldUpdateOperationsInput | number
    unitsSold?: IntFieldUpdateOperationsInput | number
    topProductId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneRequiredWithoutAnalyticsNestedInput
  }

  export type DailyAnalyticsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    revenuePaise?: IntFieldUpdateOperationsInput | number
    orderCount?: IntFieldUpdateOperationsInput | number
    unitsSold?: IntFieldUpdateOperationsInput | number
    topProductId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyAnalyticsCreateManyInput = {
    id?: string
    supplierId: string
    date: Date | string
    revenuePaise?: number
    orderCount?: number
    unitsSold?: number
    topProductId?: string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type DailyAnalyticsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    revenuePaise?: IntFieldUpdateOperationsInput | number
    orderCount?: IntFieldUpdateOperationsInput | number
    unitsSold?: IntFieldUpdateOperationsInput | number
    topProductId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyAnalyticsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    revenuePaise?: IntFieldUpdateOperationsInput | number
    orderCount?: IntFieldUpdateOperationsInput | number
    unitsSold?: IntFieldUpdateOperationsInput | number
    topProductId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
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
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumVerificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusFilter<$PrismaModel> | $Enums.VerificationStatus
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

  export type ProductListRelationFilter = {
    every?: ProductWhereInput
    some?: ProductWhereInput
    none?: ProductWhereInput
  }

  export type SupplierOrderListRelationFilter = {
    every?: SupplierOrderWhereInput
    some?: SupplierOrderWhereInput
    none?: SupplierOrderWhereInput
  }

  export type DailyAnalyticsListRelationFilter = {
    every?: DailyAnalyticsWhereInput
    some?: DailyAnalyticsWhereInput
    none?: DailyAnalyticsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProductOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SupplierOrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DailyAnalyticsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SupplierCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    companyName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    upiId?: SortOrder
    gstNumber?: SortOrder
    avatarUrl?: SortOrder
    address?: SortOrder
    businessType?: SortOrder
    yearsInOperation?: SortOrder
    productCategories?: SortOrder
    businessCertUrl?: SortOrder
    tradeLicenseUrl?: SortOrder
    ownerIdProofUrl?: SortOrder
    gstCertUrl?: SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrder
    kycReviewedAt?: SortOrder
    kycReviewedBy?: SortOrder
    taxRate?: SortOrder
    taxInclusive?: SortOrder
    kycRejectionReason?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierAvgOrderByAggregateInput = {
    taxRate?: SortOrder
  }

  export type SupplierMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    companyName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    upiId?: SortOrder
    gstNumber?: SortOrder
    avatarUrl?: SortOrder
    businessType?: SortOrder
    yearsInOperation?: SortOrder
    businessCertUrl?: SortOrder
    tradeLicenseUrl?: SortOrder
    ownerIdProofUrl?: SortOrder
    gstCertUrl?: SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrder
    kycReviewedAt?: SortOrder
    kycReviewedBy?: SortOrder
    taxRate?: SortOrder
    taxInclusive?: SortOrder
    kycRejectionReason?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    companyName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    upiId?: SortOrder
    gstNumber?: SortOrder
    avatarUrl?: SortOrder
    businessType?: SortOrder
    yearsInOperation?: SortOrder
    businessCertUrl?: SortOrder
    tradeLicenseUrl?: SortOrder
    ownerIdProofUrl?: SortOrder
    gstCertUrl?: SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrder
    kycReviewedAt?: SortOrder
    kycReviewedBy?: SortOrder
    taxRate?: SortOrder
    taxInclusive?: SortOrder
    kycRejectionReason?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierSumOrderByAggregateInput = {
    taxRate?: SortOrder
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
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
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
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumVerificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.VerificationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVerificationStatusFilter<$PrismaModel>
    _max?: NestedEnumVerificationStatusFilter<$PrismaModel>
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

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
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

  export type SupplierScalarRelationFilter = {
    is?: SupplierWhereInput
    isNot?: SupplierWhereInput
  }

  export type InventoryLogListRelationFilter = {
    every?: InventoryLogWhereInput
    some?: InventoryLogWhereInput
    none?: InventoryLogWhereInput
  }

  export type InventoryLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    supplierId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    description?: SortOrder
    price?: SortOrder
    mrp?: SortOrder
    unit?: SortOrder
    stockQuantity?: SortOrder
    reorderThreshold?: SortOrder
    images?: SortOrder
    tags?: SortOrder
    status?: SortOrder
    specifications?: SortOrder
    weight?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    price?: SortOrder
    mrp?: SortOrder
    stockQuantity?: SortOrder
    reorderThreshold?: SortOrder
    weight?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    supplierId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    description?: SortOrder
    price?: SortOrder
    mrp?: SortOrder
    unit?: SortOrder
    stockQuantity?: SortOrder
    reorderThreshold?: SortOrder
    status?: SortOrder
    weight?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    supplierId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    description?: SortOrder
    price?: SortOrder
    mrp?: SortOrder
    unit?: SortOrder
    stockQuantity?: SortOrder
    reorderThreshold?: SortOrder
    status?: SortOrder
    weight?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    price?: SortOrder
    mrp?: SortOrder
    stockQuantity?: SortOrder
    reorderThreshold?: SortOrder
    weight?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
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

  export type ProductScalarRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type InventoryLogCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    change?: SortOrder
    reason?: SortOrder
    referenceId?: SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryLogAvgOrderByAggregateInput = {
    change?: SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
  }

  export type InventoryLogMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    change?: SortOrder
    reason?: SortOrder
    referenceId?: SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryLogMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    change?: SortOrder
    reason?: SortOrder
    referenceId?: SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryLogSumOrderByAggregateInput = {
    change?: SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
  }

  export type SupplierOrderCountOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    supplierId?: SortOrder
    farmerId?: SortOrder
    items?: SortOrder
    totalPaise?: SortOrder
    paymentStatus?: SortOrder
    orderStatus?: SortOrder
    shippingAddress?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierOrderAvgOrderByAggregateInput = {
    totalPaise?: SortOrder
  }

  export type SupplierOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    supplierId?: SortOrder
    farmerId?: SortOrder
    totalPaise?: SortOrder
    paymentStatus?: SortOrder
    orderStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierOrderMinOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    supplierId?: SortOrder
    farmerId?: SortOrder
    totalPaise?: SortOrder
    paymentStatus?: SortOrder
    orderStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierOrderSumOrderByAggregateInput = {
    totalPaise?: SortOrder
  }

  export type DailyAnalyticsSupplierIdDateCompoundUniqueInput = {
    supplierId: string
    date: Date | string
  }

  export type DailyAnalyticsCountOrderByAggregateInput = {
    id?: SortOrder
    supplierId?: SortOrder
    date?: SortOrder
    revenuePaise?: SortOrder
    orderCount?: SortOrder
    unitsSold?: SortOrder
    topProductId?: SortOrder
    categoryBreakdown?: SortOrder
    createdAt?: SortOrder
  }

  export type DailyAnalyticsAvgOrderByAggregateInput = {
    revenuePaise?: SortOrder
    orderCount?: SortOrder
    unitsSold?: SortOrder
  }

  export type DailyAnalyticsMaxOrderByAggregateInput = {
    id?: SortOrder
    supplierId?: SortOrder
    date?: SortOrder
    revenuePaise?: SortOrder
    orderCount?: SortOrder
    unitsSold?: SortOrder
    topProductId?: SortOrder
    createdAt?: SortOrder
  }

  export type DailyAnalyticsMinOrderByAggregateInput = {
    id?: SortOrder
    supplierId?: SortOrder
    date?: SortOrder
    revenuePaise?: SortOrder
    orderCount?: SortOrder
    unitsSold?: SortOrder
    topProductId?: SortOrder
    createdAt?: SortOrder
  }

  export type DailyAnalyticsSumOrderByAggregateInput = {
    revenuePaise?: SortOrder
    orderCount?: SortOrder
    unitsSold?: SortOrder
  }

  export type SupplierCreateproductCategoriesInput = {
    set: string[]
  }

  export type ProductCreateNestedManyWithoutSupplierInput = {
    create?: XOR<ProductCreateWithoutSupplierInput, ProductUncheckedCreateWithoutSupplierInput> | ProductCreateWithoutSupplierInput[] | ProductUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutSupplierInput | ProductCreateOrConnectWithoutSupplierInput[]
    createMany?: ProductCreateManySupplierInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type SupplierOrderCreateNestedManyWithoutSupplierInput = {
    create?: XOR<SupplierOrderCreateWithoutSupplierInput, SupplierOrderUncheckedCreateWithoutSupplierInput> | SupplierOrderCreateWithoutSupplierInput[] | SupplierOrderUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: SupplierOrderCreateOrConnectWithoutSupplierInput | SupplierOrderCreateOrConnectWithoutSupplierInput[]
    createMany?: SupplierOrderCreateManySupplierInputEnvelope
    connect?: SupplierOrderWhereUniqueInput | SupplierOrderWhereUniqueInput[]
  }

  export type DailyAnalyticsCreateNestedManyWithoutSupplierInput = {
    create?: XOR<DailyAnalyticsCreateWithoutSupplierInput, DailyAnalyticsUncheckedCreateWithoutSupplierInput> | DailyAnalyticsCreateWithoutSupplierInput[] | DailyAnalyticsUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: DailyAnalyticsCreateOrConnectWithoutSupplierInput | DailyAnalyticsCreateOrConnectWithoutSupplierInput[]
    createMany?: DailyAnalyticsCreateManySupplierInputEnvelope
    connect?: DailyAnalyticsWhereUniqueInput | DailyAnalyticsWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutSupplierInput = {
    create?: XOR<ProductCreateWithoutSupplierInput, ProductUncheckedCreateWithoutSupplierInput> | ProductCreateWithoutSupplierInput[] | ProductUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutSupplierInput | ProductCreateOrConnectWithoutSupplierInput[]
    createMany?: ProductCreateManySupplierInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type SupplierOrderUncheckedCreateNestedManyWithoutSupplierInput = {
    create?: XOR<SupplierOrderCreateWithoutSupplierInput, SupplierOrderUncheckedCreateWithoutSupplierInput> | SupplierOrderCreateWithoutSupplierInput[] | SupplierOrderUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: SupplierOrderCreateOrConnectWithoutSupplierInput | SupplierOrderCreateOrConnectWithoutSupplierInput[]
    createMany?: SupplierOrderCreateManySupplierInputEnvelope
    connect?: SupplierOrderWhereUniqueInput | SupplierOrderWhereUniqueInput[]
  }

  export type DailyAnalyticsUncheckedCreateNestedManyWithoutSupplierInput = {
    create?: XOR<DailyAnalyticsCreateWithoutSupplierInput, DailyAnalyticsUncheckedCreateWithoutSupplierInput> | DailyAnalyticsCreateWithoutSupplierInput[] | DailyAnalyticsUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: DailyAnalyticsCreateOrConnectWithoutSupplierInput | DailyAnalyticsCreateOrConnectWithoutSupplierInput[]
    createMany?: DailyAnalyticsCreateManySupplierInputEnvelope
    connect?: DailyAnalyticsWhereUniqueInput | DailyAnalyticsWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type SupplierUpdateproductCategoriesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumVerificationStatusFieldUpdateOperationsInput = {
    set?: $Enums.VerificationStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
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

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProductUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<ProductCreateWithoutSupplierInput, ProductUncheckedCreateWithoutSupplierInput> | ProductCreateWithoutSupplierInput[] | ProductUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutSupplierInput | ProductCreateOrConnectWithoutSupplierInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutSupplierInput | ProductUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: ProductCreateManySupplierInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutSupplierInput | ProductUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutSupplierInput | ProductUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type SupplierOrderUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<SupplierOrderCreateWithoutSupplierInput, SupplierOrderUncheckedCreateWithoutSupplierInput> | SupplierOrderCreateWithoutSupplierInput[] | SupplierOrderUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: SupplierOrderCreateOrConnectWithoutSupplierInput | SupplierOrderCreateOrConnectWithoutSupplierInput[]
    upsert?: SupplierOrderUpsertWithWhereUniqueWithoutSupplierInput | SupplierOrderUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: SupplierOrderCreateManySupplierInputEnvelope
    set?: SupplierOrderWhereUniqueInput | SupplierOrderWhereUniqueInput[]
    disconnect?: SupplierOrderWhereUniqueInput | SupplierOrderWhereUniqueInput[]
    delete?: SupplierOrderWhereUniqueInput | SupplierOrderWhereUniqueInput[]
    connect?: SupplierOrderWhereUniqueInput | SupplierOrderWhereUniqueInput[]
    update?: SupplierOrderUpdateWithWhereUniqueWithoutSupplierInput | SupplierOrderUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: SupplierOrderUpdateManyWithWhereWithoutSupplierInput | SupplierOrderUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: SupplierOrderScalarWhereInput | SupplierOrderScalarWhereInput[]
  }

  export type DailyAnalyticsUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<DailyAnalyticsCreateWithoutSupplierInput, DailyAnalyticsUncheckedCreateWithoutSupplierInput> | DailyAnalyticsCreateWithoutSupplierInput[] | DailyAnalyticsUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: DailyAnalyticsCreateOrConnectWithoutSupplierInput | DailyAnalyticsCreateOrConnectWithoutSupplierInput[]
    upsert?: DailyAnalyticsUpsertWithWhereUniqueWithoutSupplierInput | DailyAnalyticsUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: DailyAnalyticsCreateManySupplierInputEnvelope
    set?: DailyAnalyticsWhereUniqueInput | DailyAnalyticsWhereUniqueInput[]
    disconnect?: DailyAnalyticsWhereUniqueInput | DailyAnalyticsWhereUniqueInput[]
    delete?: DailyAnalyticsWhereUniqueInput | DailyAnalyticsWhereUniqueInput[]
    connect?: DailyAnalyticsWhereUniqueInput | DailyAnalyticsWhereUniqueInput[]
    update?: DailyAnalyticsUpdateWithWhereUniqueWithoutSupplierInput | DailyAnalyticsUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: DailyAnalyticsUpdateManyWithWhereWithoutSupplierInput | DailyAnalyticsUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: DailyAnalyticsScalarWhereInput | DailyAnalyticsScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<ProductCreateWithoutSupplierInput, ProductUncheckedCreateWithoutSupplierInput> | ProductCreateWithoutSupplierInput[] | ProductUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutSupplierInput | ProductCreateOrConnectWithoutSupplierInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutSupplierInput | ProductUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: ProductCreateManySupplierInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutSupplierInput | ProductUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutSupplierInput | ProductUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type SupplierOrderUncheckedUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<SupplierOrderCreateWithoutSupplierInput, SupplierOrderUncheckedCreateWithoutSupplierInput> | SupplierOrderCreateWithoutSupplierInput[] | SupplierOrderUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: SupplierOrderCreateOrConnectWithoutSupplierInput | SupplierOrderCreateOrConnectWithoutSupplierInput[]
    upsert?: SupplierOrderUpsertWithWhereUniqueWithoutSupplierInput | SupplierOrderUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: SupplierOrderCreateManySupplierInputEnvelope
    set?: SupplierOrderWhereUniqueInput | SupplierOrderWhereUniqueInput[]
    disconnect?: SupplierOrderWhereUniqueInput | SupplierOrderWhereUniqueInput[]
    delete?: SupplierOrderWhereUniqueInput | SupplierOrderWhereUniqueInput[]
    connect?: SupplierOrderWhereUniqueInput | SupplierOrderWhereUniqueInput[]
    update?: SupplierOrderUpdateWithWhereUniqueWithoutSupplierInput | SupplierOrderUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: SupplierOrderUpdateManyWithWhereWithoutSupplierInput | SupplierOrderUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: SupplierOrderScalarWhereInput | SupplierOrderScalarWhereInput[]
  }

  export type DailyAnalyticsUncheckedUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<DailyAnalyticsCreateWithoutSupplierInput, DailyAnalyticsUncheckedCreateWithoutSupplierInput> | DailyAnalyticsCreateWithoutSupplierInput[] | DailyAnalyticsUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: DailyAnalyticsCreateOrConnectWithoutSupplierInput | DailyAnalyticsCreateOrConnectWithoutSupplierInput[]
    upsert?: DailyAnalyticsUpsertWithWhereUniqueWithoutSupplierInput | DailyAnalyticsUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: DailyAnalyticsCreateManySupplierInputEnvelope
    set?: DailyAnalyticsWhereUniqueInput | DailyAnalyticsWhereUniqueInput[]
    disconnect?: DailyAnalyticsWhereUniqueInput | DailyAnalyticsWhereUniqueInput[]
    delete?: DailyAnalyticsWhereUniqueInput | DailyAnalyticsWhereUniqueInput[]
    connect?: DailyAnalyticsWhereUniqueInput | DailyAnalyticsWhereUniqueInput[]
    update?: DailyAnalyticsUpdateWithWhereUniqueWithoutSupplierInput | DailyAnalyticsUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: DailyAnalyticsUpdateManyWithWhereWithoutSupplierInput | DailyAnalyticsUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: DailyAnalyticsScalarWhereInput | DailyAnalyticsScalarWhereInput[]
  }

  export type ProductCreateimagesInput = {
    set: string[]
  }

  export type ProductCreatetagsInput = {
    set: string[]
  }

  export type SupplierCreateNestedOneWithoutProductsInput = {
    create?: XOR<SupplierCreateWithoutProductsInput, SupplierUncheckedCreateWithoutProductsInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutProductsInput
    connect?: SupplierWhereUniqueInput
  }

  export type InventoryLogCreateNestedManyWithoutProductInput = {
    create?: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput> | InventoryLogCreateWithoutProductInput[] | InventoryLogUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InventoryLogCreateOrConnectWithoutProductInput | InventoryLogCreateOrConnectWithoutProductInput[]
    createMany?: InventoryLogCreateManyProductInputEnvelope
    connect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
  }

  export type InventoryLogUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput> | InventoryLogCreateWithoutProductInput[] | InventoryLogUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InventoryLogCreateOrConnectWithoutProductInput | InventoryLogCreateOrConnectWithoutProductInput[]
    createMany?: InventoryLogCreateManyProductInputEnvelope
    connect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProductUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProductUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SupplierUpdateOneRequiredWithoutProductsNestedInput = {
    create?: XOR<SupplierCreateWithoutProductsInput, SupplierUncheckedCreateWithoutProductsInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutProductsInput
    upsert?: SupplierUpsertWithoutProductsInput
    connect?: SupplierWhereUniqueInput
    update?: XOR<XOR<SupplierUpdateToOneWithWhereWithoutProductsInput, SupplierUpdateWithoutProductsInput>, SupplierUncheckedUpdateWithoutProductsInput>
  }

  export type InventoryLogUpdateManyWithoutProductNestedInput = {
    create?: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput> | InventoryLogCreateWithoutProductInput[] | InventoryLogUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InventoryLogCreateOrConnectWithoutProductInput | InventoryLogCreateOrConnectWithoutProductInput[]
    upsert?: InventoryLogUpsertWithWhereUniqueWithoutProductInput | InventoryLogUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: InventoryLogCreateManyProductInputEnvelope
    set?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    disconnect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    delete?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    connect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    update?: InventoryLogUpdateWithWhereUniqueWithoutProductInput | InventoryLogUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: InventoryLogUpdateManyWithWhereWithoutProductInput | InventoryLogUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: InventoryLogScalarWhereInput | InventoryLogScalarWhereInput[]
  }

  export type InventoryLogUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput> | InventoryLogCreateWithoutProductInput[] | InventoryLogUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InventoryLogCreateOrConnectWithoutProductInput | InventoryLogCreateOrConnectWithoutProductInput[]
    upsert?: InventoryLogUpsertWithWhereUniqueWithoutProductInput | InventoryLogUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: InventoryLogCreateManyProductInputEnvelope
    set?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    disconnect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    delete?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    connect?: InventoryLogWhereUniqueInput | InventoryLogWhereUniqueInput[]
    update?: InventoryLogUpdateWithWhereUniqueWithoutProductInput | InventoryLogUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: InventoryLogUpdateManyWithWhereWithoutProductInput | InventoryLogUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: InventoryLogScalarWhereInput | InventoryLogScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutInventoryLogsInput = {
    create?: XOR<ProductCreateWithoutInventoryLogsInput, ProductUncheckedCreateWithoutInventoryLogsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutInventoryLogsInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutInventoryLogsNestedInput = {
    create?: XOR<ProductCreateWithoutInventoryLogsInput, ProductUncheckedCreateWithoutInventoryLogsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutInventoryLogsInput
    upsert?: ProductUpsertWithoutInventoryLogsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutInventoryLogsInput, ProductUpdateWithoutInventoryLogsInput>, ProductUncheckedUpdateWithoutInventoryLogsInput>
  }

  export type SupplierCreateNestedOneWithoutOrdersInput = {
    create?: XOR<SupplierCreateWithoutOrdersInput, SupplierUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutOrdersInput
    connect?: SupplierWhereUniqueInput
  }

  export type SupplierUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<SupplierCreateWithoutOrdersInput, SupplierUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutOrdersInput
    upsert?: SupplierUpsertWithoutOrdersInput
    connect?: SupplierWhereUniqueInput
    update?: XOR<XOR<SupplierUpdateToOneWithWhereWithoutOrdersInput, SupplierUpdateWithoutOrdersInput>, SupplierUncheckedUpdateWithoutOrdersInput>
  }

  export type SupplierCreateNestedOneWithoutAnalyticsInput = {
    create?: XOR<SupplierCreateWithoutAnalyticsInput, SupplierUncheckedCreateWithoutAnalyticsInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutAnalyticsInput
    connect?: SupplierWhereUniqueInput
  }

  export type SupplierUpdateOneRequiredWithoutAnalyticsNestedInput = {
    create?: XOR<SupplierCreateWithoutAnalyticsInput, SupplierUncheckedCreateWithoutAnalyticsInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutAnalyticsInput
    upsert?: SupplierUpsertWithoutAnalyticsInput
    connect?: SupplierWhereUniqueInput
    update?: XOR<XOR<SupplierUpdateToOneWithWhereWithoutAnalyticsInput, SupplierUpdateWithoutAnalyticsInput>, SupplierUncheckedUpdateWithoutAnalyticsInput>
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

  export type NestedEnumVerificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusFilter<$PrismaModel> | $Enums.VerificationStatus
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
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
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

  export type NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.VerificationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVerificationStatusFilter<$PrismaModel>
    _max?: NestedEnumVerificationStatusFilter<$PrismaModel>
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

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
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

  export type ProductCreateWithoutSupplierInput = {
    id?: string
    name: string
    slug: string
    sku: string
    category: string
    description: string
    price: number
    mrp: number
    unit: string
    stockQuantity?: number
    reorderThreshold?: number
    images?: ProductCreateimagesInput | string[]
    tags?: ProductCreatetagsInput | string[]
    status?: string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: number | null
    rating?: number | null
    reviewCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    inventoryLogs?: InventoryLogCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutSupplierInput = {
    id?: string
    name: string
    slug: string
    sku: string
    category: string
    description: string
    price: number
    mrp: number
    unit: string
    stockQuantity?: number
    reorderThreshold?: number
    images?: ProductCreateimagesInput | string[]
    tags?: ProductCreatetagsInput | string[]
    status?: string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: number | null
    rating?: number | null
    reviewCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    inventoryLogs?: InventoryLogUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutSupplierInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutSupplierInput, ProductUncheckedCreateWithoutSupplierInput>
  }

  export type ProductCreateManySupplierInputEnvelope = {
    data: ProductCreateManySupplierInput | ProductCreateManySupplierInput[]
    skipDuplicates?: boolean
  }

  export type SupplierOrderCreateWithoutSupplierInput = {
    id?: string
    orderNumber: string
    farmerId: string
    items: JsonNullValueInput | InputJsonValue
    totalPaise: number
    paymentStatus?: string
    orderStatus?: string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierOrderUncheckedCreateWithoutSupplierInput = {
    id?: string
    orderNumber: string
    farmerId: string
    items: JsonNullValueInput | InputJsonValue
    totalPaise: number
    paymentStatus?: string
    orderStatus?: string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierOrderCreateOrConnectWithoutSupplierInput = {
    where: SupplierOrderWhereUniqueInput
    create: XOR<SupplierOrderCreateWithoutSupplierInput, SupplierOrderUncheckedCreateWithoutSupplierInput>
  }

  export type SupplierOrderCreateManySupplierInputEnvelope = {
    data: SupplierOrderCreateManySupplierInput | SupplierOrderCreateManySupplierInput[]
    skipDuplicates?: boolean
  }

  export type DailyAnalyticsCreateWithoutSupplierInput = {
    id?: string
    date: Date | string
    revenuePaise?: number
    orderCount?: number
    unitsSold?: number
    topProductId?: string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type DailyAnalyticsUncheckedCreateWithoutSupplierInput = {
    id?: string
    date: Date | string
    revenuePaise?: number
    orderCount?: number
    unitsSold?: number
    topProductId?: string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type DailyAnalyticsCreateOrConnectWithoutSupplierInput = {
    where: DailyAnalyticsWhereUniqueInput
    create: XOR<DailyAnalyticsCreateWithoutSupplierInput, DailyAnalyticsUncheckedCreateWithoutSupplierInput>
  }

  export type DailyAnalyticsCreateManySupplierInputEnvelope = {
    data: DailyAnalyticsCreateManySupplierInput | DailyAnalyticsCreateManySupplierInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithWhereUniqueWithoutSupplierInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutSupplierInput, ProductUncheckedUpdateWithoutSupplierInput>
    create: XOR<ProductCreateWithoutSupplierInput, ProductUncheckedCreateWithoutSupplierInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutSupplierInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutSupplierInput, ProductUncheckedUpdateWithoutSupplierInput>
  }

  export type ProductUpdateManyWithWhereWithoutSupplierInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutSupplierInput>
  }

  export type ProductScalarWhereInput = {
    AND?: ProductScalarWhereInput | ProductScalarWhereInput[]
    OR?: ProductScalarWhereInput[]
    NOT?: ProductScalarWhereInput | ProductScalarWhereInput[]
    id?: StringFilter<"Product"> | string
    supplierId?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    slug?: StringFilter<"Product"> | string
    sku?: StringFilter<"Product"> | string
    category?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    price?: IntFilter<"Product"> | number
    mrp?: IntFilter<"Product"> | number
    unit?: StringFilter<"Product"> | string
    stockQuantity?: IntFilter<"Product"> | number
    reorderThreshold?: IntFilter<"Product"> | number
    images?: StringNullableListFilter<"Product">
    tags?: StringNullableListFilter<"Product">
    status?: StringFilter<"Product"> | string
    specifications?: JsonNullableFilter<"Product">
    weight?: FloatNullableFilter<"Product"> | number | null
    rating?: FloatNullableFilter<"Product"> | number | null
    reviewCount?: IntFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
  }

  export type SupplierOrderUpsertWithWhereUniqueWithoutSupplierInput = {
    where: SupplierOrderWhereUniqueInput
    update: XOR<SupplierOrderUpdateWithoutSupplierInput, SupplierOrderUncheckedUpdateWithoutSupplierInput>
    create: XOR<SupplierOrderCreateWithoutSupplierInput, SupplierOrderUncheckedCreateWithoutSupplierInput>
  }

  export type SupplierOrderUpdateWithWhereUniqueWithoutSupplierInput = {
    where: SupplierOrderWhereUniqueInput
    data: XOR<SupplierOrderUpdateWithoutSupplierInput, SupplierOrderUncheckedUpdateWithoutSupplierInput>
  }

  export type SupplierOrderUpdateManyWithWhereWithoutSupplierInput = {
    where: SupplierOrderScalarWhereInput
    data: XOR<SupplierOrderUpdateManyMutationInput, SupplierOrderUncheckedUpdateManyWithoutSupplierInput>
  }

  export type SupplierOrderScalarWhereInput = {
    AND?: SupplierOrderScalarWhereInput | SupplierOrderScalarWhereInput[]
    OR?: SupplierOrderScalarWhereInput[]
    NOT?: SupplierOrderScalarWhereInput | SupplierOrderScalarWhereInput[]
    id?: StringFilter<"SupplierOrder"> | string
    orderNumber?: StringFilter<"SupplierOrder"> | string
    supplierId?: StringFilter<"SupplierOrder"> | string
    farmerId?: StringFilter<"SupplierOrder"> | string
    items?: JsonFilter<"SupplierOrder">
    totalPaise?: IntFilter<"SupplierOrder"> | number
    paymentStatus?: StringFilter<"SupplierOrder"> | string
    orderStatus?: StringFilter<"SupplierOrder"> | string
    shippingAddress?: JsonNullableFilter<"SupplierOrder">
    createdAt?: DateTimeFilter<"SupplierOrder"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierOrder"> | Date | string
  }

  export type DailyAnalyticsUpsertWithWhereUniqueWithoutSupplierInput = {
    where: DailyAnalyticsWhereUniqueInput
    update: XOR<DailyAnalyticsUpdateWithoutSupplierInput, DailyAnalyticsUncheckedUpdateWithoutSupplierInput>
    create: XOR<DailyAnalyticsCreateWithoutSupplierInput, DailyAnalyticsUncheckedCreateWithoutSupplierInput>
  }

  export type DailyAnalyticsUpdateWithWhereUniqueWithoutSupplierInput = {
    where: DailyAnalyticsWhereUniqueInput
    data: XOR<DailyAnalyticsUpdateWithoutSupplierInput, DailyAnalyticsUncheckedUpdateWithoutSupplierInput>
  }

  export type DailyAnalyticsUpdateManyWithWhereWithoutSupplierInput = {
    where: DailyAnalyticsScalarWhereInput
    data: XOR<DailyAnalyticsUpdateManyMutationInput, DailyAnalyticsUncheckedUpdateManyWithoutSupplierInput>
  }

  export type DailyAnalyticsScalarWhereInput = {
    AND?: DailyAnalyticsScalarWhereInput | DailyAnalyticsScalarWhereInput[]
    OR?: DailyAnalyticsScalarWhereInput[]
    NOT?: DailyAnalyticsScalarWhereInput | DailyAnalyticsScalarWhereInput[]
    id?: StringFilter<"DailyAnalytics"> | string
    supplierId?: StringFilter<"DailyAnalytics"> | string
    date?: DateTimeFilter<"DailyAnalytics"> | Date | string
    revenuePaise?: IntFilter<"DailyAnalytics"> | number
    orderCount?: IntFilter<"DailyAnalytics"> | number
    unitsSold?: IntFilter<"DailyAnalytics"> | number
    topProductId?: StringNullableFilter<"DailyAnalytics"> | string | null
    categoryBreakdown?: JsonNullableFilter<"DailyAnalytics">
    createdAt?: DateTimeFilter<"DailyAnalytics"> | Date | string
  }

  export type SupplierCreateWithoutProductsInput = {
    id?: string
    userId: string
    companyName: string
    email: string
    phone: string
    upiId?: string | null
    gstNumber?: string | null
    avatarUrl?: string | null
    address: JsonNullValueInput | InputJsonValue
    businessType?: string | null
    yearsInOperation?: string | null
    productCategories?: SupplierCreateproductCategoriesInput | string[]
    businessCertUrl?: string | null
    tradeLicenseUrl?: string | null
    ownerIdProofUrl?: string | null
    gstCertUrl?: string | null
    kycStatus?: $Enums.VerificationStatus
    kycSubmittedAt?: Date | string | null
    kycReviewedAt?: Date | string | null
    kycReviewedBy?: string | null
    taxRate?: number | null
    taxInclusive?: boolean
    kycRejectionReason?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: SupplierOrderCreateNestedManyWithoutSupplierInput
    analytics?: DailyAnalyticsCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUncheckedCreateWithoutProductsInput = {
    id?: string
    userId: string
    companyName: string
    email: string
    phone: string
    upiId?: string | null
    gstNumber?: string | null
    avatarUrl?: string | null
    address: JsonNullValueInput | InputJsonValue
    businessType?: string | null
    yearsInOperation?: string | null
    productCategories?: SupplierCreateproductCategoriesInput | string[]
    businessCertUrl?: string | null
    tradeLicenseUrl?: string | null
    ownerIdProofUrl?: string | null
    gstCertUrl?: string | null
    kycStatus?: $Enums.VerificationStatus
    kycSubmittedAt?: Date | string | null
    kycReviewedAt?: Date | string | null
    kycReviewedBy?: string | null
    taxRate?: number | null
    taxInclusive?: boolean
    kycRejectionReason?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: SupplierOrderUncheckedCreateNestedManyWithoutSupplierInput
    analytics?: DailyAnalyticsUncheckedCreateNestedManyWithoutSupplierInput
  }

  export type SupplierCreateOrConnectWithoutProductsInput = {
    where: SupplierWhereUniqueInput
    create: XOR<SupplierCreateWithoutProductsInput, SupplierUncheckedCreateWithoutProductsInput>
  }

  export type InventoryLogCreateWithoutProductInput = {
    id?: string
    supplierId: string
    change: number
    reason: string
    referenceId?: string | null
    previousStock: number
    newStock: number
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryLogUncheckedCreateWithoutProductInput = {
    id?: string
    supplierId: string
    change: number
    reason: string
    referenceId?: string | null
    previousStock: number
    newStock: number
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryLogCreateOrConnectWithoutProductInput = {
    where: InventoryLogWhereUniqueInput
    create: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput>
  }

  export type InventoryLogCreateManyProductInputEnvelope = {
    data: InventoryLogCreateManyProductInput | InventoryLogCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type SupplierUpsertWithoutProductsInput = {
    update: XOR<SupplierUpdateWithoutProductsInput, SupplierUncheckedUpdateWithoutProductsInput>
    create: XOR<SupplierCreateWithoutProductsInput, SupplierUncheckedCreateWithoutProductsInput>
    where?: SupplierWhereInput
  }

  export type SupplierUpdateToOneWithWhereWithoutProductsInput = {
    where?: SupplierWhereInput
    data: XOR<SupplierUpdateWithoutProductsInput, SupplierUncheckedUpdateWithoutProductsInput>
  }

  export type SupplierUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    upiId?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    yearsInOperation?: NullableStringFieldUpdateOperationsInput | string | null
    productCategories?: SupplierUpdateproductCategoriesInput | string[]
    businessCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tradeLicenseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerIdProofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gstCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    taxInclusive?: BoolFieldUpdateOperationsInput | boolean
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: SupplierOrderUpdateManyWithoutSupplierNestedInput
    analytics?: DailyAnalyticsUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierUncheckedUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    upiId?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    yearsInOperation?: NullableStringFieldUpdateOperationsInput | string | null
    productCategories?: SupplierUpdateproductCategoriesInput | string[]
    businessCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tradeLicenseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerIdProofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gstCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    taxInclusive?: BoolFieldUpdateOperationsInput | boolean
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: SupplierOrderUncheckedUpdateManyWithoutSupplierNestedInput
    analytics?: DailyAnalyticsUncheckedUpdateManyWithoutSupplierNestedInput
  }

  export type InventoryLogUpsertWithWhereUniqueWithoutProductInput = {
    where: InventoryLogWhereUniqueInput
    update: XOR<InventoryLogUpdateWithoutProductInput, InventoryLogUncheckedUpdateWithoutProductInput>
    create: XOR<InventoryLogCreateWithoutProductInput, InventoryLogUncheckedCreateWithoutProductInput>
  }

  export type InventoryLogUpdateWithWhereUniqueWithoutProductInput = {
    where: InventoryLogWhereUniqueInput
    data: XOR<InventoryLogUpdateWithoutProductInput, InventoryLogUncheckedUpdateWithoutProductInput>
  }

  export type InventoryLogUpdateManyWithWhereWithoutProductInput = {
    where: InventoryLogScalarWhereInput
    data: XOR<InventoryLogUpdateManyMutationInput, InventoryLogUncheckedUpdateManyWithoutProductInput>
  }

  export type InventoryLogScalarWhereInput = {
    AND?: InventoryLogScalarWhereInput | InventoryLogScalarWhereInput[]
    OR?: InventoryLogScalarWhereInput[]
    NOT?: InventoryLogScalarWhereInput | InventoryLogScalarWhereInput[]
    id?: StringFilter<"InventoryLog"> | string
    productId?: StringFilter<"InventoryLog"> | string
    supplierId?: StringFilter<"InventoryLog"> | string
    change?: IntFilter<"InventoryLog"> | number
    reason?: StringFilter<"InventoryLog"> | string
    referenceId?: StringNullableFilter<"InventoryLog"> | string | null
    previousStock?: IntFilter<"InventoryLog"> | number
    newStock?: IntFilter<"InventoryLog"> | number
    notes?: StringNullableFilter<"InventoryLog"> | string | null
    createdAt?: DateTimeFilter<"InventoryLog"> | Date | string
  }

  export type ProductCreateWithoutInventoryLogsInput = {
    id?: string
    name: string
    slug: string
    sku: string
    category: string
    description: string
    price: number
    mrp: number
    unit: string
    stockQuantity?: number
    reorderThreshold?: number
    images?: ProductCreateimagesInput | string[]
    tags?: ProductCreatetagsInput | string[]
    status?: string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: number | null
    rating?: number | null
    reviewCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    supplier: SupplierCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutInventoryLogsInput = {
    id?: string
    supplierId: string
    name: string
    slug: string
    sku: string
    category: string
    description: string
    price: number
    mrp: number
    unit: string
    stockQuantity?: number
    reorderThreshold?: number
    images?: ProductCreateimagesInput | string[]
    tags?: ProductCreatetagsInput | string[]
    status?: string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: number | null
    rating?: number | null
    reviewCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductCreateOrConnectWithoutInventoryLogsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutInventoryLogsInput, ProductUncheckedCreateWithoutInventoryLogsInput>
  }

  export type ProductUpsertWithoutInventoryLogsInput = {
    update: XOR<ProductUpdateWithoutInventoryLogsInput, ProductUncheckedUpdateWithoutInventoryLogsInput>
    create: XOR<ProductCreateWithoutInventoryLogsInput, ProductUncheckedCreateWithoutInventoryLogsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutInventoryLogsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutInventoryLogsInput, ProductUncheckedUpdateWithoutInventoryLogsInput>
  }

  export type ProductUpdateWithoutInventoryLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    mrp?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    stockQuantity?: IntFieldUpdateOperationsInput | number
    reorderThreshold?: IntFieldUpdateOperationsInput | number
    images?: ProductUpdateimagesInput | string[]
    tags?: ProductUpdatetagsInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    reviewCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneRequiredWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutInventoryLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    mrp?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    stockQuantity?: IntFieldUpdateOperationsInput | number
    reorderThreshold?: IntFieldUpdateOperationsInput | number
    images?: ProductUpdateimagesInput | string[]
    tags?: ProductUpdatetagsInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    reviewCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierCreateWithoutOrdersInput = {
    id?: string
    userId: string
    companyName: string
    email: string
    phone: string
    upiId?: string | null
    gstNumber?: string | null
    avatarUrl?: string | null
    address: JsonNullValueInput | InputJsonValue
    businessType?: string | null
    yearsInOperation?: string | null
    productCategories?: SupplierCreateproductCategoriesInput | string[]
    businessCertUrl?: string | null
    tradeLicenseUrl?: string | null
    ownerIdProofUrl?: string | null
    gstCertUrl?: string | null
    kycStatus?: $Enums.VerificationStatus
    kycSubmittedAt?: Date | string | null
    kycReviewedAt?: Date | string | null
    kycReviewedBy?: string | null
    taxRate?: number | null
    taxInclusive?: boolean
    kycRejectionReason?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductCreateNestedManyWithoutSupplierInput
    analytics?: DailyAnalyticsCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUncheckedCreateWithoutOrdersInput = {
    id?: string
    userId: string
    companyName: string
    email: string
    phone: string
    upiId?: string | null
    gstNumber?: string | null
    avatarUrl?: string | null
    address: JsonNullValueInput | InputJsonValue
    businessType?: string | null
    yearsInOperation?: string | null
    productCategories?: SupplierCreateproductCategoriesInput | string[]
    businessCertUrl?: string | null
    tradeLicenseUrl?: string | null
    ownerIdProofUrl?: string | null
    gstCertUrl?: string | null
    kycStatus?: $Enums.VerificationStatus
    kycSubmittedAt?: Date | string | null
    kycReviewedAt?: Date | string | null
    kycReviewedBy?: string | null
    taxRate?: number | null
    taxInclusive?: boolean
    kycRejectionReason?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductUncheckedCreateNestedManyWithoutSupplierInput
    analytics?: DailyAnalyticsUncheckedCreateNestedManyWithoutSupplierInput
  }

  export type SupplierCreateOrConnectWithoutOrdersInput = {
    where: SupplierWhereUniqueInput
    create: XOR<SupplierCreateWithoutOrdersInput, SupplierUncheckedCreateWithoutOrdersInput>
  }

  export type SupplierUpsertWithoutOrdersInput = {
    update: XOR<SupplierUpdateWithoutOrdersInput, SupplierUncheckedUpdateWithoutOrdersInput>
    create: XOR<SupplierCreateWithoutOrdersInput, SupplierUncheckedCreateWithoutOrdersInput>
    where?: SupplierWhereInput
  }

  export type SupplierUpdateToOneWithWhereWithoutOrdersInput = {
    where?: SupplierWhereInput
    data: XOR<SupplierUpdateWithoutOrdersInput, SupplierUncheckedUpdateWithoutOrdersInput>
  }

  export type SupplierUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    upiId?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    yearsInOperation?: NullableStringFieldUpdateOperationsInput | string | null
    productCategories?: SupplierUpdateproductCategoriesInput | string[]
    businessCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tradeLicenseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerIdProofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gstCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    taxInclusive?: BoolFieldUpdateOperationsInput | boolean
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUpdateManyWithoutSupplierNestedInput
    analytics?: DailyAnalyticsUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    upiId?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    yearsInOperation?: NullableStringFieldUpdateOperationsInput | string | null
    productCategories?: SupplierUpdateproductCategoriesInput | string[]
    businessCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tradeLicenseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerIdProofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gstCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    taxInclusive?: BoolFieldUpdateOperationsInput | boolean
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUncheckedUpdateManyWithoutSupplierNestedInput
    analytics?: DailyAnalyticsUncheckedUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierCreateWithoutAnalyticsInput = {
    id?: string
    userId: string
    companyName: string
    email: string
    phone: string
    upiId?: string | null
    gstNumber?: string | null
    avatarUrl?: string | null
    address: JsonNullValueInput | InputJsonValue
    businessType?: string | null
    yearsInOperation?: string | null
    productCategories?: SupplierCreateproductCategoriesInput | string[]
    businessCertUrl?: string | null
    tradeLicenseUrl?: string | null
    ownerIdProofUrl?: string | null
    gstCertUrl?: string | null
    kycStatus?: $Enums.VerificationStatus
    kycSubmittedAt?: Date | string | null
    kycReviewedAt?: Date | string | null
    kycReviewedBy?: string | null
    taxRate?: number | null
    taxInclusive?: boolean
    kycRejectionReason?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductCreateNestedManyWithoutSupplierInput
    orders?: SupplierOrderCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUncheckedCreateWithoutAnalyticsInput = {
    id?: string
    userId: string
    companyName: string
    email: string
    phone: string
    upiId?: string | null
    gstNumber?: string | null
    avatarUrl?: string | null
    address: JsonNullValueInput | InputJsonValue
    businessType?: string | null
    yearsInOperation?: string | null
    productCategories?: SupplierCreateproductCategoriesInput | string[]
    businessCertUrl?: string | null
    tradeLicenseUrl?: string | null
    ownerIdProofUrl?: string | null
    gstCertUrl?: string | null
    kycStatus?: $Enums.VerificationStatus
    kycSubmittedAt?: Date | string | null
    kycReviewedAt?: Date | string | null
    kycReviewedBy?: string | null
    taxRate?: number | null
    taxInclusive?: boolean
    kycRejectionReason?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductUncheckedCreateNestedManyWithoutSupplierInput
    orders?: SupplierOrderUncheckedCreateNestedManyWithoutSupplierInput
  }

  export type SupplierCreateOrConnectWithoutAnalyticsInput = {
    where: SupplierWhereUniqueInput
    create: XOR<SupplierCreateWithoutAnalyticsInput, SupplierUncheckedCreateWithoutAnalyticsInput>
  }

  export type SupplierUpsertWithoutAnalyticsInput = {
    update: XOR<SupplierUpdateWithoutAnalyticsInput, SupplierUncheckedUpdateWithoutAnalyticsInput>
    create: XOR<SupplierCreateWithoutAnalyticsInput, SupplierUncheckedCreateWithoutAnalyticsInput>
    where?: SupplierWhereInput
  }

  export type SupplierUpdateToOneWithWhereWithoutAnalyticsInput = {
    where?: SupplierWhereInput
    data: XOR<SupplierUpdateWithoutAnalyticsInput, SupplierUncheckedUpdateWithoutAnalyticsInput>
  }

  export type SupplierUpdateWithoutAnalyticsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    upiId?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    yearsInOperation?: NullableStringFieldUpdateOperationsInput | string | null
    productCategories?: SupplierUpdateproductCategoriesInput | string[]
    businessCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tradeLicenseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerIdProofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gstCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    taxInclusive?: BoolFieldUpdateOperationsInput | boolean
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUpdateManyWithoutSupplierNestedInput
    orders?: SupplierOrderUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierUncheckedUpdateWithoutAnalyticsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    upiId?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    yearsInOperation?: NullableStringFieldUpdateOperationsInput | string | null
    productCategories?: SupplierUpdateproductCategoriesInput | string[]
    businessCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tradeLicenseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerIdProofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gstCertUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycReviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    taxInclusive?: BoolFieldUpdateOperationsInput | boolean
    kycRejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUncheckedUpdateManyWithoutSupplierNestedInput
    orders?: SupplierOrderUncheckedUpdateManyWithoutSupplierNestedInput
  }

  export type ProductCreateManySupplierInput = {
    id?: string
    name: string
    slug: string
    sku: string
    category: string
    description: string
    price: number
    mrp: number
    unit: string
    stockQuantity?: number
    reorderThreshold?: number
    images?: ProductCreateimagesInput | string[]
    tags?: ProductCreatetagsInput | string[]
    status?: string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: number | null
    rating?: number | null
    reviewCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierOrderCreateManySupplierInput = {
    id?: string
    orderNumber: string
    farmerId: string
    items: JsonNullValueInput | InputJsonValue
    totalPaise: number
    paymentStatus?: string
    orderStatus?: string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailyAnalyticsCreateManySupplierInput = {
    id?: string
    date: Date | string
    revenuePaise?: number
    orderCount?: number
    unitsSold?: number
    topProductId?: string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ProductUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    mrp?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    stockQuantity?: IntFieldUpdateOperationsInput | number
    reorderThreshold?: IntFieldUpdateOperationsInput | number
    images?: ProductUpdateimagesInput | string[]
    tags?: ProductUpdatetagsInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    reviewCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryLogs?: InventoryLogUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    mrp?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    stockQuantity?: IntFieldUpdateOperationsInput | number
    reorderThreshold?: IntFieldUpdateOperationsInput | number
    images?: ProductUpdateimagesInput | string[]
    tags?: ProductUpdatetagsInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    reviewCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryLogs?: InventoryLogUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    mrp?: IntFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    stockQuantity?: IntFieldUpdateOperationsInput | number
    reorderThreshold?: IntFieldUpdateOperationsInput | number
    images?: ProductUpdateimagesInput | string[]
    tags?: ProductUpdatetagsInput | string[]
    status?: StringFieldUpdateOperationsInput | string
    specifications?: NullableJsonNullValueInput | InputJsonValue
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    reviewCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierOrderUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalPaise?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierOrderUncheckedUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalPaise?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierOrderUncheckedUpdateManyWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalPaise?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    shippingAddress?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyAnalyticsUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    revenuePaise?: IntFieldUpdateOperationsInput | number
    orderCount?: IntFieldUpdateOperationsInput | number
    unitsSold?: IntFieldUpdateOperationsInput | number
    topProductId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyAnalyticsUncheckedUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    revenuePaise?: IntFieldUpdateOperationsInput | number
    orderCount?: IntFieldUpdateOperationsInput | number
    unitsSold?: IntFieldUpdateOperationsInput | number
    topProductId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyAnalyticsUncheckedUpdateManyWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    revenuePaise?: IntFieldUpdateOperationsInput | number
    orderCount?: IntFieldUpdateOperationsInput | number
    unitsSold?: IntFieldUpdateOperationsInput | number
    topProductId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryLogCreateManyProductInput = {
    id?: string
    supplierId: string
    change: number
    reason: string
    referenceId?: string | null
    previousStock: number
    newStock: number
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryLogUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    change?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryLogUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    change?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryLogUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    change?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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