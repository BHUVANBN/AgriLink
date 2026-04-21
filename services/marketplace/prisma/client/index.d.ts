
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
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>
/**
 * Model CartItem
 * 
 */
export type CartItem = $Result.DefaultSelection<Prisma.$CartItemPayload>
/**
 * Model Review
 * 
 */
export type Review = $Result.DefaultSelection<Prisma.$ReviewPayload>
/**
 * Model Inquiry
 * 
 */
export type Inquiry = $Result.DefaultSelection<Prisma.$InquiryPayload>
/**
 * Model InquiryReply
 * 
 */
export type InquiryReply = $Result.DefaultSelection<Prisma.$InquiryReplyPayload>
/**
 * Model CommunityDeal
 * 
 */
export type CommunityDeal = $Result.DefaultSelection<Prisma.$CommunityDealPayload>
/**
 * Model DealParticipant
 * 
 */
export type DealParticipant = $Result.DefaultSelection<Prisma.$DealParticipantPayload>
/**
 * Model WishlistItem
 * 
 */
export type WishlistItem = $Result.DefaultSelection<Prisma.$WishlistItemPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PaymentStatus: {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]


export const OrderStatus: {
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED'
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]


export const PaymentMethod: {
  RAZORPAY: 'RAZORPAY',
  COD: 'COD'
};

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]


export const InquiryStatus: {
  OPEN: 'OPEN',
  RESPONDED: 'RESPONDED',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

export type InquiryStatus = (typeof InquiryStatus)[keyof typeof InquiryStatus]

}

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

export type OrderStatus = $Enums.OrderStatus

export const OrderStatus: typeof $Enums.OrderStatus

export type PaymentMethod = $Enums.PaymentMethod

export const PaymentMethod: typeof $Enums.PaymentMethod

export type InquiryStatus = $Enums.InquiryStatus

export const InquiryStatus: typeof $Enums.InquiryStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Orders
 * const orders = await prisma.order.findMany()
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
   * // Fetch zero or more Orders
   * const orders = await prisma.order.findMany()
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
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cartItem`: Exposes CRUD operations for the **CartItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CartItems
    * const cartItems = await prisma.cartItem.findMany()
    * ```
    */
  get cartItem(): Prisma.CartItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.review`: Exposes CRUD operations for the **Review** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reviews
    * const reviews = await prisma.review.findMany()
    * ```
    */
  get review(): Prisma.ReviewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inquiry`: Exposes CRUD operations for the **Inquiry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inquiries
    * const inquiries = await prisma.inquiry.findMany()
    * ```
    */
  get inquiry(): Prisma.InquiryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inquiryReply`: Exposes CRUD operations for the **InquiryReply** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InquiryReplies
    * const inquiryReplies = await prisma.inquiryReply.findMany()
    * ```
    */
  get inquiryReply(): Prisma.InquiryReplyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.communityDeal`: Exposes CRUD operations for the **CommunityDeal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommunityDeals
    * const communityDeals = await prisma.communityDeal.findMany()
    * ```
    */
  get communityDeal(): Prisma.CommunityDealDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dealParticipant`: Exposes CRUD operations for the **DealParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DealParticipants
    * const dealParticipants = await prisma.dealParticipant.findMany()
    * ```
    */
  get dealParticipant(): Prisma.DealParticipantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wishlistItem`: Exposes CRUD operations for the **WishlistItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WishlistItems
    * const wishlistItems = await prisma.wishlistItem.findMany()
    * ```
    */
  get wishlistItem(): Prisma.WishlistItemDelegate<ExtArgs, ClientOptions>;
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
    Order: 'Order',
    CartItem: 'CartItem',
    Review: 'Review',
    Inquiry: 'Inquiry',
    InquiryReply: 'InquiryReply',
    CommunityDeal: 'CommunityDeal',
    DealParticipant: 'DealParticipant',
    WishlistItem: 'WishlistItem'
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
      modelProps: "order" | "cartItem" | "review" | "inquiry" | "inquiryReply" | "communityDeal" | "dealParticipant" | "wishlistItem"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
      CartItem: {
        payload: Prisma.$CartItemPayload<ExtArgs>
        fields: Prisma.CartItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CartItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CartItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          findFirst: {
            args: Prisma.CartItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CartItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          findMany: {
            args: Prisma.CartItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>[]
          }
          create: {
            args: Prisma.CartItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          createMany: {
            args: Prisma.CartItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CartItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>[]
          }
          delete: {
            args: Prisma.CartItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          update: {
            args: Prisma.CartItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          deleteMany: {
            args: Prisma.CartItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CartItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CartItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>[]
          }
          upsert: {
            args: Prisma.CartItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          aggregate: {
            args: Prisma.CartItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCartItem>
          }
          groupBy: {
            args: Prisma.CartItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<CartItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.CartItemCountArgs<ExtArgs>
            result: $Utils.Optional<CartItemCountAggregateOutputType> | number
          }
        }
      }
      Review: {
        payload: Prisma.$ReviewPayload<ExtArgs>
        fields: Prisma.ReviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findFirst: {
            args: Prisma.ReviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findMany: {
            args: Prisma.ReviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          create: {
            args: Prisma.ReviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          createMany: {
            args: Prisma.ReviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          delete: {
            args: Prisma.ReviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          update: {
            args: Prisma.ReviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          deleteMany: {
            args: Prisma.ReviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReviewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          upsert: {
            args: Prisma.ReviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          aggregate: {
            args: Prisma.ReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReview>
          }
          groupBy: {
            args: Prisma.ReviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReviewCountArgs<ExtArgs>
            result: $Utils.Optional<ReviewCountAggregateOutputType> | number
          }
        }
      }
      Inquiry: {
        payload: Prisma.$InquiryPayload<ExtArgs>
        fields: Prisma.InquiryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InquiryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InquiryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          findFirst: {
            args: Prisma.InquiryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InquiryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          findMany: {
            args: Prisma.InquiryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>[]
          }
          create: {
            args: Prisma.InquiryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          createMany: {
            args: Prisma.InquiryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InquiryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>[]
          }
          delete: {
            args: Prisma.InquiryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          update: {
            args: Prisma.InquiryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          deleteMany: {
            args: Prisma.InquiryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InquiryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InquiryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>[]
          }
          upsert: {
            args: Prisma.InquiryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryPayload>
          }
          aggregate: {
            args: Prisma.InquiryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInquiry>
          }
          groupBy: {
            args: Prisma.InquiryGroupByArgs<ExtArgs>
            result: $Utils.Optional<InquiryGroupByOutputType>[]
          }
          count: {
            args: Prisma.InquiryCountArgs<ExtArgs>
            result: $Utils.Optional<InquiryCountAggregateOutputType> | number
          }
        }
      }
      InquiryReply: {
        payload: Prisma.$InquiryReplyPayload<ExtArgs>
        fields: Prisma.InquiryReplyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InquiryReplyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryReplyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InquiryReplyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryReplyPayload>
          }
          findFirst: {
            args: Prisma.InquiryReplyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryReplyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InquiryReplyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryReplyPayload>
          }
          findMany: {
            args: Prisma.InquiryReplyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryReplyPayload>[]
          }
          create: {
            args: Prisma.InquiryReplyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryReplyPayload>
          }
          createMany: {
            args: Prisma.InquiryReplyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InquiryReplyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryReplyPayload>[]
          }
          delete: {
            args: Prisma.InquiryReplyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryReplyPayload>
          }
          update: {
            args: Prisma.InquiryReplyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryReplyPayload>
          }
          deleteMany: {
            args: Prisma.InquiryReplyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InquiryReplyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InquiryReplyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryReplyPayload>[]
          }
          upsert: {
            args: Prisma.InquiryReplyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InquiryReplyPayload>
          }
          aggregate: {
            args: Prisma.InquiryReplyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInquiryReply>
          }
          groupBy: {
            args: Prisma.InquiryReplyGroupByArgs<ExtArgs>
            result: $Utils.Optional<InquiryReplyGroupByOutputType>[]
          }
          count: {
            args: Prisma.InquiryReplyCountArgs<ExtArgs>
            result: $Utils.Optional<InquiryReplyCountAggregateOutputType> | number
          }
        }
      }
      CommunityDeal: {
        payload: Prisma.$CommunityDealPayload<ExtArgs>
        fields: Prisma.CommunityDealFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommunityDealFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityDealPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommunityDealFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityDealPayload>
          }
          findFirst: {
            args: Prisma.CommunityDealFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityDealPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommunityDealFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityDealPayload>
          }
          findMany: {
            args: Prisma.CommunityDealFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityDealPayload>[]
          }
          create: {
            args: Prisma.CommunityDealCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityDealPayload>
          }
          createMany: {
            args: Prisma.CommunityDealCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommunityDealCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityDealPayload>[]
          }
          delete: {
            args: Prisma.CommunityDealDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityDealPayload>
          }
          update: {
            args: Prisma.CommunityDealUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityDealPayload>
          }
          deleteMany: {
            args: Prisma.CommunityDealDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommunityDealUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CommunityDealUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityDealPayload>[]
          }
          upsert: {
            args: Prisma.CommunityDealUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityDealPayload>
          }
          aggregate: {
            args: Prisma.CommunityDealAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommunityDeal>
          }
          groupBy: {
            args: Prisma.CommunityDealGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommunityDealGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommunityDealCountArgs<ExtArgs>
            result: $Utils.Optional<CommunityDealCountAggregateOutputType> | number
          }
        }
      }
      DealParticipant: {
        payload: Prisma.$DealParticipantPayload<ExtArgs>
        fields: Prisma.DealParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DealParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DealParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DealParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DealParticipantPayload>
          }
          findFirst: {
            args: Prisma.DealParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DealParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DealParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DealParticipantPayload>
          }
          findMany: {
            args: Prisma.DealParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DealParticipantPayload>[]
          }
          create: {
            args: Prisma.DealParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DealParticipantPayload>
          }
          createMany: {
            args: Prisma.DealParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DealParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DealParticipantPayload>[]
          }
          delete: {
            args: Prisma.DealParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DealParticipantPayload>
          }
          update: {
            args: Prisma.DealParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DealParticipantPayload>
          }
          deleteMany: {
            args: Prisma.DealParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DealParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DealParticipantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DealParticipantPayload>[]
          }
          upsert: {
            args: Prisma.DealParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DealParticipantPayload>
          }
          aggregate: {
            args: Prisma.DealParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDealParticipant>
          }
          groupBy: {
            args: Prisma.DealParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<DealParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.DealParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<DealParticipantCountAggregateOutputType> | number
          }
        }
      }
      WishlistItem: {
        payload: Prisma.$WishlistItemPayload<ExtArgs>
        fields: Prisma.WishlistItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WishlistItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WishlistItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          findFirst: {
            args: Prisma.WishlistItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WishlistItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          findMany: {
            args: Prisma.WishlistItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>[]
          }
          create: {
            args: Prisma.WishlistItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          createMany: {
            args: Prisma.WishlistItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WishlistItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>[]
          }
          delete: {
            args: Prisma.WishlistItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          update: {
            args: Prisma.WishlistItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          deleteMany: {
            args: Prisma.WishlistItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WishlistItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WishlistItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>[]
          }
          upsert: {
            args: Prisma.WishlistItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          aggregate: {
            args: Prisma.WishlistItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWishlistItem>
          }
          groupBy: {
            args: Prisma.WishlistItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<WishlistItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.WishlistItemCountArgs<ExtArgs>
            result: $Utils.Optional<WishlistItemCountAggregateOutputType> | number
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
    order?: OrderOmit
    cartItem?: CartItemOmit
    review?: ReviewOmit
    inquiry?: InquiryOmit
    inquiryReply?: InquiryReplyOmit
    communityDeal?: CommunityDealOmit
    dealParticipant?: DealParticipantOmit
    wishlistItem?: WishlistItemOmit
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
   * Count Type InquiryCountOutputType
   */

  export type InquiryCountOutputType = {
    replies: number
  }

  export type InquiryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | InquiryCountOutputTypeCountRepliesArgs
  }

  // Custom InputTypes
  /**
   * InquiryCountOutputType without action
   */
  export type InquiryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryCountOutputType
     */
    select?: InquiryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InquiryCountOutputType without action
   */
  export type InquiryCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InquiryReplyWhereInput
  }


  /**
   * Count Type CommunityDealCountOutputType
   */

  export type CommunityDealCountOutputType = {
    participants: number
  }

  export type CommunityDealCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | CommunityDealCountOutputTypeCountParticipantsArgs
  }

  // Custom InputTypes
  /**
   * CommunityDealCountOutputType without action
   */
  export type CommunityDealCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDealCountOutputType
     */
    select?: CommunityDealCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CommunityDealCountOutputType without action
   */
  export type CommunityDealCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DealParticipantWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderAvgAggregateOutputType = {
    subtotalPaise: number | null
    taxPaise: number | null
    shippingPaise: number | null
    totalPaise: number | null
  }

  export type OrderSumAggregateOutputType = {
    subtotalPaise: number | null
    taxPaise: number | null
    shippingPaise: number | null
    totalPaise: number | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    orderNumber: string | null
    farmerId: string | null
    supplierId: string | null
    subtotalPaise: number | null
    taxPaise: number | null
    shippingPaise: number | null
    totalPaise: number | null
    paymentMethod: $Enums.PaymentMethod | null
    paymentStatus: $Enums.PaymentStatus | null
    razorpayOrderId: string | null
    razorpayPaymentId: string | null
    razorpaySignature: string | null
    paidAt: Date | null
    orderStatus: $Enums.OrderStatus | null
    trackingNumber: string | null
    carrier: string | null
    estimatedDelivery: Date | null
    actualDelivery: Date | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    orderNumber: string | null
    farmerId: string | null
    supplierId: string | null
    subtotalPaise: number | null
    taxPaise: number | null
    shippingPaise: number | null
    totalPaise: number | null
    paymentMethod: $Enums.PaymentMethod | null
    paymentStatus: $Enums.PaymentStatus | null
    razorpayOrderId: string | null
    razorpayPaymentId: string | null
    razorpaySignature: string | null
    paidAt: Date | null
    orderStatus: $Enums.OrderStatus | null
    trackingNumber: string | null
    carrier: string | null
    estimatedDelivery: Date | null
    actualDelivery: Date | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    orderNumber: number
    farmerId: number
    supplierId: number
    items: number
    subtotalPaise: number
    taxPaise: number
    shippingPaise: number
    totalPaise: number
    paymentMethod: number
    paymentStatus: number
    razorpayOrderId: number
    razorpayPaymentId: number
    razorpaySignature: number
    paidAt: number
    orderStatus: number
    shippingAddress: number
    trackingNumber: number
    carrier: number
    estimatedDelivery: number
    actualDelivery: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrderAvgAggregateInputType = {
    subtotalPaise?: true
    taxPaise?: true
    shippingPaise?: true
    totalPaise?: true
  }

  export type OrderSumAggregateInputType = {
    subtotalPaise?: true
    taxPaise?: true
    shippingPaise?: true
    totalPaise?: true
  }

  export type OrderMinAggregateInputType = {
    id?: true
    orderNumber?: true
    farmerId?: true
    supplierId?: true
    subtotalPaise?: true
    taxPaise?: true
    shippingPaise?: true
    totalPaise?: true
    paymentMethod?: true
    paymentStatus?: true
    razorpayOrderId?: true
    razorpayPaymentId?: true
    razorpaySignature?: true
    paidAt?: true
    orderStatus?: true
    trackingNumber?: true
    carrier?: true
    estimatedDelivery?: true
    actualDelivery?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    orderNumber?: true
    farmerId?: true
    supplierId?: true
    subtotalPaise?: true
    taxPaise?: true
    shippingPaise?: true
    totalPaise?: true
    paymentMethod?: true
    paymentStatus?: true
    razorpayOrderId?: true
    razorpayPaymentId?: true
    razorpaySignature?: true
    paidAt?: true
    orderStatus?: true
    trackingNumber?: true
    carrier?: true
    estimatedDelivery?: true
    actualDelivery?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    orderNumber?: true
    farmerId?: true
    supplierId?: true
    items?: true
    subtotalPaise?: true
    taxPaise?: true
    shippingPaise?: true
    totalPaise?: true
    paymentMethod?: true
    paymentStatus?: true
    razorpayOrderId?: true
    razorpayPaymentId?: true
    razorpaySignature?: true
    paidAt?: true
    orderStatus?: true
    shippingAddress?: true
    trackingNumber?: true
    carrier?: true
    estimatedDelivery?: true
    actualDelivery?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _avg?: OrderAvgAggregateInputType
    _sum?: OrderSumAggregateInputType
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    orderNumber: string
    farmerId: string
    supplierId: string
    items: JsonValue
    subtotalPaise: number
    taxPaise: number
    shippingPaise: number
    totalPaise: number
    paymentMethod: $Enums.PaymentMethod
    paymentStatus: $Enums.PaymentStatus
    razorpayOrderId: string | null
    razorpayPaymentId: string | null
    razorpaySignature: string | null
    paidAt: Date | null
    orderStatus: $Enums.OrderStatus
    shippingAddress: JsonValue
    trackingNumber: string | null
    carrier: string | null
    estimatedDelivery: Date | null
    actualDelivery: Date | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    farmerId?: boolean
    supplierId?: boolean
    items?: boolean
    subtotalPaise?: boolean
    taxPaise?: boolean
    shippingPaise?: boolean
    totalPaise?: boolean
    paymentMethod?: boolean
    paymentStatus?: boolean
    razorpayOrderId?: boolean
    razorpayPaymentId?: boolean
    razorpaySignature?: boolean
    paidAt?: boolean
    orderStatus?: boolean
    shippingAddress?: boolean
    trackingNumber?: boolean
    carrier?: boolean
    estimatedDelivery?: boolean
    actualDelivery?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["order"]>

  export type OrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    farmerId?: boolean
    supplierId?: boolean
    items?: boolean
    subtotalPaise?: boolean
    taxPaise?: boolean
    shippingPaise?: boolean
    totalPaise?: boolean
    paymentMethod?: boolean
    paymentStatus?: boolean
    razorpayOrderId?: boolean
    razorpayPaymentId?: boolean
    razorpaySignature?: boolean
    paidAt?: boolean
    orderStatus?: boolean
    shippingAddress?: boolean
    trackingNumber?: boolean
    carrier?: boolean
    estimatedDelivery?: boolean
    actualDelivery?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["order"]>

  export type OrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    farmerId?: boolean
    supplierId?: boolean
    items?: boolean
    subtotalPaise?: boolean
    taxPaise?: boolean
    shippingPaise?: boolean
    totalPaise?: boolean
    paymentMethod?: boolean
    paymentStatus?: boolean
    razorpayOrderId?: boolean
    razorpayPaymentId?: boolean
    razorpaySignature?: boolean
    paidAt?: boolean
    orderStatus?: boolean
    shippingAddress?: boolean
    trackingNumber?: boolean
    carrier?: boolean
    estimatedDelivery?: boolean
    actualDelivery?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["order"]>

  export type OrderSelectScalar = {
    id?: boolean
    orderNumber?: boolean
    farmerId?: boolean
    supplierId?: boolean
    items?: boolean
    subtotalPaise?: boolean
    taxPaise?: boolean
    shippingPaise?: boolean
    totalPaise?: boolean
    paymentMethod?: boolean
    paymentStatus?: boolean
    razorpayOrderId?: boolean
    razorpayPaymentId?: boolean
    razorpaySignature?: boolean
    paidAt?: boolean
    orderStatus?: boolean
    shippingAddress?: boolean
    trackingNumber?: boolean
    carrier?: boolean
    estimatedDelivery?: boolean
    actualDelivery?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderNumber" | "farmerId" | "supplierId" | "items" | "subtotalPaise" | "taxPaise" | "shippingPaise" | "totalPaise" | "paymentMethod" | "paymentStatus" | "razorpayOrderId" | "razorpayPaymentId" | "razorpaySignature" | "paidAt" | "orderStatus" | "shippingAddress" | "trackingNumber" | "carrier" | "estimatedDelivery" | "actualDelivery" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["order"]>

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderNumber: string
      farmerId: string
      supplierId: string
      items: Prisma.JsonValue
      subtotalPaise: number
      taxPaise: number
      shippingPaise: number
      totalPaise: number
      paymentMethod: $Enums.PaymentMethod
      paymentStatus: $Enums.PaymentStatus
      razorpayOrderId: string | null
      razorpayPaymentId: string | null
      razorpaySignature: string | null
      paidAt: Date | null
      orderStatus: $Enums.OrderStatus
      shippingAddress: Prisma.JsonValue
      trackingNumber: string | null
      carrier: string | null
      estimatedDelivery: Date | null
      actualDelivery: Date | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders and returns the data updated in the database.
     * @param {OrderUpdateManyAndReturnArgs} args - Arguments to update many Orders.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.updateManyAndReturn({
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
    updateManyAndReturn<T extends OrderUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
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
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Order model
   */
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly orderNumber: FieldRef<"Order", 'String'>
    readonly farmerId: FieldRef<"Order", 'String'>
    readonly supplierId: FieldRef<"Order", 'String'>
    readonly items: FieldRef<"Order", 'Json'>
    readonly subtotalPaise: FieldRef<"Order", 'Int'>
    readonly taxPaise: FieldRef<"Order", 'Int'>
    readonly shippingPaise: FieldRef<"Order", 'Int'>
    readonly totalPaise: FieldRef<"Order", 'Int'>
    readonly paymentMethod: FieldRef<"Order", 'PaymentMethod'>
    readonly paymentStatus: FieldRef<"Order", 'PaymentStatus'>
    readonly razorpayOrderId: FieldRef<"Order", 'String'>
    readonly razorpayPaymentId: FieldRef<"Order", 'String'>
    readonly razorpaySignature: FieldRef<"Order", 'String'>
    readonly paidAt: FieldRef<"Order", 'DateTime'>
    readonly orderStatus: FieldRef<"Order", 'OrderStatus'>
    readonly shippingAddress: FieldRef<"Order", 'Json'>
    readonly trackingNumber: FieldRef<"Order", 'String'>
    readonly carrier: FieldRef<"Order", 'String'>
    readonly estimatedDelivery: FieldRef<"Order", 'DateTime'>
    readonly actualDelivery: FieldRef<"Order", 'DateTime'>
    readonly notes: FieldRef<"Order", 'String'>
    readonly createdAt: FieldRef<"Order", 'DateTime'>
    readonly updatedAt: FieldRef<"Order", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order createManyAndReturn
   */
  export type OrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
  }

  /**
   * Order updateManyAndReturn
   */
  export type OrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to delete.
     */
    limit?: number
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
  }


  /**
   * Model CartItem
   */

  export type AggregateCartItem = {
    _count: CartItemCountAggregateOutputType | null
    _avg: CartItemAvgAggregateOutputType | null
    _sum: CartItemSumAggregateOutputType | null
    _min: CartItemMinAggregateOutputType | null
    _max: CartItemMaxAggregateOutputType | null
  }

  export type CartItemAvgAggregateOutputType = {
    quantity: number | null
  }

  export type CartItemSumAggregateOutputType = {
    quantity: number | null
  }

  export type CartItemMinAggregateOutputType = {
    id: string | null
    farmerId: string | null
    productId: string | null
    supplierId: string | null
    quantity: number | null
    addedAt: Date | null
    updatedAt: Date | null
  }

  export type CartItemMaxAggregateOutputType = {
    id: string | null
    farmerId: string | null
    productId: string | null
    supplierId: string | null
    quantity: number | null
    addedAt: Date | null
    updatedAt: Date | null
  }

  export type CartItemCountAggregateOutputType = {
    id: number
    farmerId: number
    productId: number
    supplierId: number
    quantity: number
    snapshot: number
    addedAt: number
    updatedAt: number
    _all: number
  }


  export type CartItemAvgAggregateInputType = {
    quantity?: true
  }

  export type CartItemSumAggregateInputType = {
    quantity?: true
  }

  export type CartItemMinAggregateInputType = {
    id?: true
    farmerId?: true
    productId?: true
    supplierId?: true
    quantity?: true
    addedAt?: true
    updatedAt?: true
  }

  export type CartItemMaxAggregateInputType = {
    id?: true
    farmerId?: true
    productId?: true
    supplierId?: true
    quantity?: true
    addedAt?: true
    updatedAt?: true
  }

  export type CartItemCountAggregateInputType = {
    id?: true
    farmerId?: true
    productId?: true
    supplierId?: true
    quantity?: true
    snapshot?: true
    addedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CartItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CartItem to aggregate.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CartItems
    **/
    _count?: true | CartItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CartItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CartItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CartItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CartItemMaxAggregateInputType
  }

  export type GetCartItemAggregateType<T extends CartItemAggregateArgs> = {
        [P in keyof T & keyof AggregateCartItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCartItem[P]>
      : GetScalarType<T[P], AggregateCartItem[P]>
  }




  export type CartItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartItemWhereInput
    orderBy?: CartItemOrderByWithAggregationInput | CartItemOrderByWithAggregationInput[]
    by: CartItemScalarFieldEnum[] | CartItemScalarFieldEnum
    having?: CartItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CartItemCountAggregateInputType | true
    _avg?: CartItemAvgAggregateInputType
    _sum?: CartItemSumAggregateInputType
    _min?: CartItemMinAggregateInputType
    _max?: CartItemMaxAggregateInputType
  }

  export type CartItemGroupByOutputType = {
    id: string
    farmerId: string
    productId: string
    supplierId: string
    quantity: number
    snapshot: JsonValue
    addedAt: Date
    updatedAt: Date
    _count: CartItemCountAggregateOutputType | null
    _avg: CartItemAvgAggregateOutputType | null
    _sum: CartItemSumAggregateOutputType | null
    _min: CartItemMinAggregateOutputType | null
    _max: CartItemMaxAggregateOutputType | null
  }

  type GetCartItemGroupByPayload<T extends CartItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CartItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CartItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CartItemGroupByOutputType[P]>
            : GetScalarType<T[P], CartItemGroupByOutputType[P]>
        }
      >
    >


  export type CartItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    farmerId?: boolean
    productId?: boolean
    supplierId?: boolean
    quantity?: boolean
    snapshot?: boolean
    addedAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cartItem"]>

  export type CartItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    farmerId?: boolean
    productId?: boolean
    supplierId?: boolean
    quantity?: boolean
    snapshot?: boolean
    addedAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cartItem"]>

  export type CartItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    farmerId?: boolean
    productId?: boolean
    supplierId?: boolean
    quantity?: boolean
    snapshot?: boolean
    addedAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cartItem"]>

  export type CartItemSelectScalar = {
    id?: boolean
    farmerId?: boolean
    productId?: boolean
    supplierId?: boolean
    quantity?: boolean
    snapshot?: boolean
    addedAt?: boolean
    updatedAt?: boolean
  }

  export type CartItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "farmerId" | "productId" | "supplierId" | "quantity" | "snapshot" | "addedAt" | "updatedAt", ExtArgs["result"]["cartItem"]>

  export type $CartItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CartItem"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      farmerId: string
      productId: string
      supplierId: string
      quantity: number
      snapshot: Prisma.JsonValue
      addedAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cartItem"]>
    composites: {}
  }

  type CartItemGetPayload<S extends boolean | null | undefined | CartItemDefaultArgs> = $Result.GetResult<Prisma.$CartItemPayload, S>

  type CartItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CartItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CartItemCountAggregateInputType | true
    }

  export interface CartItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CartItem'], meta: { name: 'CartItem' } }
    /**
     * Find zero or one CartItem that matches the filter.
     * @param {CartItemFindUniqueArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CartItemFindUniqueArgs>(args: SelectSubset<T, CartItemFindUniqueArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CartItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CartItemFindUniqueOrThrowArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CartItemFindUniqueOrThrowArgs>(args: SelectSubset<T, CartItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CartItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindFirstArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CartItemFindFirstArgs>(args?: SelectSubset<T, CartItemFindFirstArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CartItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindFirstOrThrowArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CartItemFindFirstOrThrowArgs>(args?: SelectSubset<T, CartItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CartItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CartItems
     * const cartItems = await prisma.cartItem.findMany()
     * 
     * // Get first 10 CartItems
     * const cartItems = await prisma.cartItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cartItemWithIdOnly = await prisma.cartItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CartItemFindManyArgs>(args?: SelectSubset<T, CartItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CartItem.
     * @param {CartItemCreateArgs} args - Arguments to create a CartItem.
     * @example
     * // Create one CartItem
     * const CartItem = await prisma.cartItem.create({
     *   data: {
     *     // ... data to create a CartItem
     *   }
     * })
     * 
     */
    create<T extends CartItemCreateArgs>(args: SelectSubset<T, CartItemCreateArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CartItems.
     * @param {CartItemCreateManyArgs} args - Arguments to create many CartItems.
     * @example
     * // Create many CartItems
     * const cartItem = await prisma.cartItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CartItemCreateManyArgs>(args?: SelectSubset<T, CartItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CartItems and returns the data saved in the database.
     * @param {CartItemCreateManyAndReturnArgs} args - Arguments to create many CartItems.
     * @example
     * // Create many CartItems
     * const cartItem = await prisma.cartItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CartItems and only return the `id`
     * const cartItemWithIdOnly = await prisma.cartItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CartItemCreateManyAndReturnArgs>(args?: SelectSubset<T, CartItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CartItem.
     * @param {CartItemDeleteArgs} args - Arguments to delete one CartItem.
     * @example
     * // Delete one CartItem
     * const CartItem = await prisma.cartItem.delete({
     *   where: {
     *     // ... filter to delete one CartItem
     *   }
     * })
     * 
     */
    delete<T extends CartItemDeleteArgs>(args: SelectSubset<T, CartItemDeleteArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CartItem.
     * @param {CartItemUpdateArgs} args - Arguments to update one CartItem.
     * @example
     * // Update one CartItem
     * const cartItem = await prisma.cartItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CartItemUpdateArgs>(args: SelectSubset<T, CartItemUpdateArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CartItems.
     * @param {CartItemDeleteManyArgs} args - Arguments to filter CartItems to delete.
     * @example
     * // Delete a few CartItems
     * const { count } = await prisma.cartItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CartItemDeleteManyArgs>(args?: SelectSubset<T, CartItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CartItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CartItems
     * const cartItem = await prisma.cartItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CartItemUpdateManyArgs>(args: SelectSubset<T, CartItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CartItems and returns the data updated in the database.
     * @param {CartItemUpdateManyAndReturnArgs} args - Arguments to update many CartItems.
     * @example
     * // Update many CartItems
     * const cartItem = await prisma.cartItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CartItems and only return the `id`
     * const cartItemWithIdOnly = await prisma.cartItem.updateManyAndReturn({
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
    updateManyAndReturn<T extends CartItemUpdateManyAndReturnArgs>(args: SelectSubset<T, CartItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CartItem.
     * @param {CartItemUpsertArgs} args - Arguments to update or create a CartItem.
     * @example
     * // Update or create a CartItem
     * const cartItem = await prisma.cartItem.upsert({
     *   create: {
     *     // ... data to create a CartItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CartItem we want to update
     *   }
     * })
     */
    upsert<T extends CartItemUpsertArgs>(args: SelectSubset<T, CartItemUpsertArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CartItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemCountArgs} args - Arguments to filter CartItems to count.
     * @example
     * // Count the number of CartItems
     * const count = await prisma.cartItem.count({
     *   where: {
     *     // ... the filter for the CartItems we want to count
     *   }
     * })
    **/
    count<T extends CartItemCountArgs>(
      args?: Subset<T, CartItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CartItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CartItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CartItemAggregateArgs>(args: Subset<T, CartItemAggregateArgs>): Prisma.PrismaPromise<GetCartItemAggregateType<T>>

    /**
     * Group by CartItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemGroupByArgs} args - Group by arguments.
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
      T extends CartItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CartItemGroupByArgs['orderBy'] }
        : { orderBy?: CartItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CartItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCartItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CartItem model
   */
  readonly fields: CartItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CartItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CartItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CartItem model
   */
  interface CartItemFieldRefs {
    readonly id: FieldRef<"CartItem", 'String'>
    readonly farmerId: FieldRef<"CartItem", 'String'>
    readonly productId: FieldRef<"CartItem", 'String'>
    readonly supplierId: FieldRef<"CartItem", 'String'>
    readonly quantity: FieldRef<"CartItem", 'Int'>
    readonly snapshot: FieldRef<"CartItem", 'Json'>
    readonly addedAt: FieldRef<"CartItem", 'DateTime'>
    readonly updatedAt: FieldRef<"CartItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CartItem findUnique
   */
  export type CartItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem findUniqueOrThrow
   */
  export type CartItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem findFirst
   */
  export type CartItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CartItems.
     */
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem findFirstOrThrow
   */
  export type CartItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CartItems.
     */
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem findMany
   */
  export type CartItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Filter, which CartItems to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem create
   */
  export type CartItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * The data needed to create a CartItem.
     */
    data: XOR<CartItemCreateInput, CartItemUncheckedCreateInput>
  }

  /**
   * CartItem createMany
   */
  export type CartItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CartItems.
     */
    data: CartItemCreateManyInput | CartItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CartItem createManyAndReturn
   */
  export type CartItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * The data used to create many CartItems.
     */
    data: CartItemCreateManyInput | CartItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CartItem update
   */
  export type CartItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * The data needed to update a CartItem.
     */
    data: XOR<CartItemUpdateInput, CartItemUncheckedUpdateInput>
    /**
     * Choose, which CartItem to update.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem updateMany
   */
  export type CartItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CartItems.
     */
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyInput>
    /**
     * Filter which CartItems to update
     */
    where?: CartItemWhereInput
    /**
     * Limit how many CartItems to update.
     */
    limit?: number
  }

  /**
   * CartItem updateManyAndReturn
   */
  export type CartItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * The data used to update CartItems.
     */
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyInput>
    /**
     * Filter which CartItems to update
     */
    where?: CartItemWhereInput
    /**
     * Limit how many CartItems to update.
     */
    limit?: number
  }

  /**
   * CartItem upsert
   */
  export type CartItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * The filter to search for the CartItem to update in case it exists.
     */
    where: CartItemWhereUniqueInput
    /**
     * In case the CartItem found by the `where` argument doesn't exist, create a new CartItem with this data.
     */
    create: XOR<CartItemCreateInput, CartItemUncheckedCreateInput>
    /**
     * In case the CartItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CartItemUpdateInput, CartItemUncheckedUpdateInput>
  }

  /**
   * CartItem delete
   */
  export type CartItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Filter which CartItem to delete.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem deleteMany
   */
  export type CartItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CartItems to delete
     */
    where?: CartItemWhereInput
    /**
     * Limit how many CartItems to delete.
     */
    limit?: number
  }

  /**
   * CartItem without action
   */
  export type CartItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
  }


  /**
   * Model Review
   */

  export type AggregateReview = {
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  export type ReviewAvgAggregateOutputType = {
    rating: number | null
  }

  export type ReviewSumAggregateOutputType = {
    rating: number | null
  }

  export type ReviewMinAggregateOutputType = {
    id: string | null
    productId: string | null
    supplierId: string | null
    farmerId: string | null
    orderId: string | null
    rating: number | null
    title: string | null
    body: string | null
    isVerified: boolean | null
    isFlagged: boolean | null
    flagReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReviewMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    supplierId: string | null
    farmerId: string | null
    orderId: string | null
    rating: number | null
    title: string | null
    body: string | null
    isVerified: boolean | null
    isFlagged: boolean | null
    flagReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReviewCountAggregateOutputType = {
    id: number
    productId: number
    supplierId: number
    farmerId: number
    orderId: number
    rating: number
    title: number
    body: number
    isVerified: number
    isFlagged: number
    flagReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReviewAvgAggregateInputType = {
    rating?: true
  }

  export type ReviewSumAggregateInputType = {
    rating?: true
  }

  export type ReviewMinAggregateInputType = {
    id?: true
    productId?: true
    supplierId?: true
    farmerId?: true
    orderId?: true
    rating?: true
    title?: true
    body?: true
    isVerified?: true
    isFlagged?: true
    flagReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReviewMaxAggregateInputType = {
    id?: true
    productId?: true
    supplierId?: true
    farmerId?: true
    orderId?: true
    rating?: true
    title?: true
    body?: true
    isVerified?: true
    isFlagged?: true
    flagReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReviewCountAggregateInputType = {
    id?: true
    productId?: true
    supplierId?: true
    farmerId?: true
    orderId?: true
    rating?: true
    title?: true
    body?: true
    isVerified?: true
    isFlagged?: true
    flagReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Review to aggregate.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reviews
    **/
    _count?: true | ReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReviewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReviewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReviewMaxAggregateInputType
  }

  export type GetReviewAggregateType<T extends ReviewAggregateArgs> = {
        [P in keyof T & keyof AggregateReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReview[P]>
      : GetScalarType<T[P], AggregateReview[P]>
  }




  export type ReviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithAggregationInput | ReviewOrderByWithAggregationInput[]
    by: ReviewScalarFieldEnum[] | ReviewScalarFieldEnum
    having?: ReviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReviewCountAggregateInputType | true
    _avg?: ReviewAvgAggregateInputType
    _sum?: ReviewSumAggregateInputType
    _min?: ReviewMinAggregateInputType
    _max?: ReviewMaxAggregateInputType
  }

  export type ReviewGroupByOutputType = {
    id: string
    productId: string
    supplierId: string
    farmerId: string
    orderId: string | null
    rating: number
    title: string
    body: string
    isVerified: boolean
    isFlagged: boolean
    flagReason: string | null
    createdAt: Date
    updatedAt: Date
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  type GetReviewGroupByPayload<T extends ReviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReviewGroupByOutputType[P]>
            : GetScalarType<T[P], ReviewGroupByOutputType[P]>
        }
      >
    >


  export type ReviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    farmerId?: boolean
    orderId?: boolean
    rating?: boolean
    title?: boolean
    body?: boolean
    isVerified?: boolean
    isFlagged?: boolean
    flagReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    farmerId?: boolean
    orderId?: boolean
    rating?: boolean
    title?: boolean
    body?: boolean
    isVerified?: boolean
    isFlagged?: boolean
    flagReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    farmerId?: boolean
    orderId?: boolean
    rating?: boolean
    title?: boolean
    body?: boolean
    isVerified?: boolean
    isFlagged?: boolean
    flagReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectScalar = {
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    farmerId?: boolean
    orderId?: boolean
    rating?: boolean
    title?: boolean
    body?: boolean
    isVerified?: boolean
    isFlagged?: boolean
    flagReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReviewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "supplierId" | "farmerId" | "orderId" | "rating" | "title" | "body" | "isVerified" | "isFlagged" | "flagReason" | "createdAt" | "updatedAt", ExtArgs["result"]["review"]>

  export type $ReviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Review"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      supplierId: string
      farmerId: string
      orderId: string | null
      rating: number
      title: string
      body: string
      isVerified: boolean
      isFlagged: boolean
      flagReason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["review"]>
    composites: {}
  }

  type ReviewGetPayload<S extends boolean | null | undefined | ReviewDefaultArgs> = $Result.GetResult<Prisma.$ReviewPayload, S>

  type ReviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReviewCountAggregateInputType | true
    }

  export interface ReviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Review'], meta: { name: 'Review' } }
    /**
     * Find zero or one Review that matches the filter.
     * @param {ReviewFindUniqueArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReviewFindUniqueArgs>(args: SelectSubset<T, ReviewFindUniqueArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Review that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReviewFindUniqueOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReviewFindUniqueOrThrowArgs>(args: SelectSubset<T, ReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Review that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReviewFindFirstArgs>(args?: SelectSubset<T, ReviewFindFirstArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Review that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReviewFindFirstOrThrowArgs>(args?: SelectSubset<T, ReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reviews
     * const reviews = await prisma.review.findMany()
     * 
     * // Get first 10 Reviews
     * const reviews = await prisma.review.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reviewWithIdOnly = await prisma.review.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReviewFindManyArgs>(args?: SelectSubset<T, ReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Review.
     * @param {ReviewCreateArgs} args - Arguments to create a Review.
     * @example
     * // Create one Review
     * const Review = await prisma.review.create({
     *   data: {
     *     // ... data to create a Review
     *   }
     * })
     * 
     */
    create<T extends ReviewCreateArgs>(args: SelectSubset<T, ReviewCreateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reviews.
     * @param {ReviewCreateManyArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReviewCreateManyArgs>(args?: SelectSubset<T, ReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reviews and returns the data saved in the database.
     * @param {ReviewCreateManyAndReturnArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReviewCreateManyAndReturnArgs>(args?: SelectSubset<T, ReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Review.
     * @param {ReviewDeleteArgs} args - Arguments to delete one Review.
     * @example
     * // Delete one Review
     * const Review = await prisma.review.delete({
     *   where: {
     *     // ... filter to delete one Review
     *   }
     * })
     * 
     */
    delete<T extends ReviewDeleteArgs>(args: SelectSubset<T, ReviewDeleteArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Review.
     * @param {ReviewUpdateArgs} args - Arguments to update one Review.
     * @example
     * // Update one Review
     * const review = await prisma.review.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReviewUpdateArgs>(args: SelectSubset<T, ReviewUpdateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reviews.
     * @param {ReviewDeleteManyArgs} args - Arguments to filter Reviews to delete.
     * @example
     * // Delete a few Reviews
     * const { count } = await prisma.review.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReviewDeleteManyArgs>(args?: SelectSubset<T, ReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReviewUpdateManyArgs>(args: SelectSubset<T, ReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews and returns the data updated in the database.
     * @param {ReviewUpdateManyAndReturnArgs} args - Arguments to update many Reviews.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.updateManyAndReturn({
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
    updateManyAndReturn<T extends ReviewUpdateManyAndReturnArgs>(args: SelectSubset<T, ReviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Review.
     * @param {ReviewUpsertArgs} args - Arguments to update or create a Review.
     * @example
     * // Update or create a Review
     * const review = await prisma.review.upsert({
     *   create: {
     *     // ... data to create a Review
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Review we want to update
     *   }
     * })
     */
    upsert<T extends ReviewUpsertArgs>(args: SelectSubset<T, ReviewUpsertArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewCountArgs} args - Arguments to filter Reviews to count.
     * @example
     * // Count the number of Reviews
     * const count = await prisma.review.count({
     *   where: {
     *     // ... the filter for the Reviews we want to count
     *   }
     * })
    **/
    count<T extends ReviewCountArgs>(
      args?: Subset<T, ReviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReviewAggregateArgs>(args: Subset<T, ReviewAggregateArgs>): Prisma.PrismaPromise<GetReviewAggregateType<T>>

    /**
     * Group by Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewGroupByArgs} args - Group by arguments.
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
      T extends ReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReviewGroupByArgs['orderBy'] }
        : { orderBy?: ReviewGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Review model
   */
  readonly fields: ReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Review.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Review model
   */
  interface ReviewFieldRefs {
    readonly id: FieldRef<"Review", 'String'>
    readonly productId: FieldRef<"Review", 'String'>
    readonly supplierId: FieldRef<"Review", 'String'>
    readonly farmerId: FieldRef<"Review", 'String'>
    readonly orderId: FieldRef<"Review", 'String'>
    readonly rating: FieldRef<"Review", 'Int'>
    readonly title: FieldRef<"Review", 'String'>
    readonly body: FieldRef<"Review", 'String'>
    readonly isVerified: FieldRef<"Review", 'Boolean'>
    readonly isFlagged: FieldRef<"Review", 'Boolean'>
    readonly flagReason: FieldRef<"Review", 'String'>
    readonly createdAt: FieldRef<"Review", 'DateTime'>
    readonly updatedAt: FieldRef<"Review", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Review findUnique
   */
  export type ReviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findUniqueOrThrow
   */
  export type ReviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findFirst
   */
  export type ReviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findFirstOrThrow
   */
  export type ReviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findMany
   */
  export type ReviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter, which Reviews to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review create
   */
  export type ReviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data needed to create a Review.
     */
    data: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
  }

  /**
   * Review createMany
   */
  export type ReviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Review createManyAndReturn
   */
  export type ReviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Review update
   */
  export type ReviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data needed to update a Review.
     */
    data: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
    /**
     * Choose, which Review to update.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review updateMany
   */
  export type ReviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to update.
     */
    limit?: number
  }

  /**
   * Review updateManyAndReturn
   */
  export type ReviewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to update.
     */
    limit?: number
  }

  /**
   * Review upsert
   */
  export type ReviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The filter to search for the Review to update in case it exists.
     */
    where: ReviewWhereUniqueInput
    /**
     * In case the Review found by the `where` argument doesn't exist, create a new Review with this data.
     */
    create: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
    /**
     * In case the Review was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
  }

  /**
   * Review delete
   */
  export type ReviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Filter which Review to delete.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review deleteMany
   */
  export type ReviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reviews to delete
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to delete.
     */
    limit?: number
  }

  /**
   * Review without action
   */
  export type ReviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
  }


  /**
   * Model Inquiry
   */

  export type AggregateInquiry = {
    _count: InquiryCountAggregateOutputType | null
    _min: InquiryMinAggregateOutputType | null
    _max: InquiryMaxAggregateOutputType | null
  }

  export type InquiryMinAggregateOutputType = {
    id: string | null
    productId: string | null
    farmerId: string | null
    supplierId: string | null
    subject: string | null
    body: string | null
    status: $Enums.InquiryStatus | null
    lastMessageAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InquiryMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    farmerId: string | null
    supplierId: string | null
    subject: string | null
    body: string | null
    status: $Enums.InquiryStatus | null
    lastMessageAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InquiryCountAggregateOutputType = {
    id: number
    productId: number
    farmerId: number
    supplierId: number
    subject: number
    body: number
    status: number
    lastMessageAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InquiryMinAggregateInputType = {
    id?: true
    productId?: true
    farmerId?: true
    supplierId?: true
    subject?: true
    body?: true
    status?: true
    lastMessageAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InquiryMaxAggregateInputType = {
    id?: true
    productId?: true
    farmerId?: true
    supplierId?: true
    subject?: true
    body?: true
    status?: true
    lastMessageAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InquiryCountAggregateInputType = {
    id?: true
    productId?: true
    farmerId?: true
    supplierId?: true
    subject?: true
    body?: true
    status?: true
    lastMessageAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InquiryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inquiry to aggregate.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inquiries
    **/
    _count?: true | InquiryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InquiryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InquiryMaxAggregateInputType
  }

  export type GetInquiryAggregateType<T extends InquiryAggregateArgs> = {
        [P in keyof T & keyof AggregateInquiry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInquiry[P]>
      : GetScalarType<T[P], AggregateInquiry[P]>
  }




  export type InquiryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InquiryWhereInput
    orderBy?: InquiryOrderByWithAggregationInput | InquiryOrderByWithAggregationInput[]
    by: InquiryScalarFieldEnum[] | InquiryScalarFieldEnum
    having?: InquiryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InquiryCountAggregateInputType | true
    _min?: InquiryMinAggregateInputType
    _max?: InquiryMaxAggregateInputType
  }

  export type InquiryGroupByOutputType = {
    id: string
    productId: string | null
    farmerId: string
    supplierId: string
    subject: string
    body: string
    status: $Enums.InquiryStatus
    lastMessageAt: Date
    createdAt: Date
    updatedAt: Date
    _count: InquiryCountAggregateOutputType | null
    _min: InquiryMinAggregateOutputType | null
    _max: InquiryMaxAggregateOutputType | null
  }

  type GetInquiryGroupByPayload<T extends InquiryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InquiryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InquiryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InquiryGroupByOutputType[P]>
            : GetScalarType<T[P], InquiryGroupByOutputType[P]>
        }
      >
    >


  export type InquirySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    farmerId?: boolean
    supplierId?: boolean
    subject?: boolean
    body?: boolean
    status?: boolean
    lastMessageAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    replies?: boolean | Inquiry$repliesArgs<ExtArgs>
    _count?: boolean | InquiryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inquiry"]>

  export type InquirySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    farmerId?: boolean
    supplierId?: boolean
    subject?: boolean
    body?: boolean
    status?: boolean
    lastMessageAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["inquiry"]>

  export type InquirySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    farmerId?: boolean
    supplierId?: boolean
    subject?: boolean
    body?: boolean
    status?: boolean
    lastMessageAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["inquiry"]>

  export type InquirySelectScalar = {
    id?: boolean
    productId?: boolean
    farmerId?: boolean
    supplierId?: boolean
    subject?: boolean
    body?: boolean
    status?: boolean
    lastMessageAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InquiryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "farmerId" | "supplierId" | "subject" | "body" | "status" | "lastMessageAt" | "createdAt" | "updatedAt", ExtArgs["result"]["inquiry"]>
  export type InquiryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | Inquiry$repliesArgs<ExtArgs>
    _count?: boolean | InquiryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InquiryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type InquiryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $InquiryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inquiry"
    objects: {
      replies: Prisma.$InquiryReplyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string | null
      farmerId: string
      supplierId: string
      subject: string
      body: string
      status: $Enums.InquiryStatus
      lastMessageAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inquiry"]>
    composites: {}
  }

  type InquiryGetPayload<S extends boolean | null | undefined | InquiryDefaultArgs> = $Result.GetResult<Prisma.$InquiryPayload, S>

  type InquiryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InquiryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InquiryCountAggregateInputType | true
    }

  export interface InquiryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inquiry'], meta: { name: 'Inquiry' } }
    /**
     * Find zero or one Inquiry that matches the filter.
     * @param {InquiryFindUniqueArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InquiryFindUniqueArgs>(args: SelectSubset<T, InquiryFindUniqueArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Inquiry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InquiryFindUniqueOrThrowArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InquiryFindUniqueOrThrowArgs>(args: SelectSubset<T, InquiryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inquiry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryFindFirstArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InquiryFindFirstArgs>(args?: SelectSubset<T, InquiryFindFirstArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inquiry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryFindFirstOrThrowArgs} args - Arguments to find a Inquiry
     * @example
     * // Get one Inquiry
     * const inquiry = await prisma.inquiry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InquiryFindFirstOrThrowArgs>(args?: SelectSubset<T, InquiryFindFirstOrThrowArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Inquiries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inquiries
     * const inquiries = await prisma.inquiry.findMany()
     * 
     * // Get first 10 Inquiries
     * const inquiries = await prisma.inquiry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inquiryWithIdOnly = await prisma.inquiry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InquiryFindManyArgs>(args?: SelectSubset<T, InquiryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Inquiry.
     * @param {InquiryCreateArgs} args - Arguments to create a Inquiry.
     * @example
     * // Create one Inquiry
     * const Inquiry = await prisma.inquiry.create({
     *   data: {
     *     // ... data to create a Inquiry
     *   }
     * })
     * 
     */
    create<T extends InquiryCreateArgs>(args: SelectSubset<T, InquiryCreateArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Inquiries.
     * @param {InquiryCreateManyArgs} args - Arguments to create many Inquiries.
     * @example
     * // Create many Inquiries
     * const inquiry = await prisma.inquiry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InquiryCreateManyArgs>(args?: SelectSubset<T, InquiryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inquiries and returns the data saved in the database.
     * @param {InquiryCreateManyAndReturnArgs} args - Arguments to create many Inquiries.
     * @example
     * // Create many Inquiries
     * const inquiry = await prisma.inquiry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inquiries and only return the `id`
     * const inquiryWithIdOnly = await prisma.inquiry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InquiryCreateManyAndReturnArgs>(args?: SelectSubset<T, InquiryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Inquiry.
     * @param {InquiryDeleteArgs} args - Arguments to delete one Inquiry.
     * @example
     * // Delete one Inquiry
     * const Inquiry = await prisma.inquiry.delete({
     *   where: {
     *     // ... filter to delete one Inquiry
     *   }
     * })
     * 
     */
    delete<T extends InquiryDeleteArgs>(args: SelectSubset<T, InquiryDeleteArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Inquiry.
     * @param {InquiryUpdateArgs} args - Arguments to update one Inquiry.
     * @example
     * // Update one Inquiry
     * const inquiry = await prisma.inquiry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InquiryUpdateArgs>(args: SelectSubset<T, InquiryUpdateArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Inquiries.
     * @param {InquiryDeleteManyArgs} args - Arguments to filter Inquiries to delete.
     * @example
     * // Delete a few Inquiries
     * const { count } = await prisma.inquiry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InquiryDeleteManyArgs>(args?: SelectSubset<T, InquiryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inquiries
     * const inquiry = await prisma.inquiry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InquiryUpdateManyArgs>(args: SelectSubset<T, InquiryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inquiries and returns the data updated in the database.
     * @param {InquiryUpdateManyAndReturnArgs} args - Arguments to update many Inquiries.
     * @example
     * // Update many Inquiries
     * const inquiry = await prisma.inquiry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Inquiries and only return the `id`
     * const inquiryWithIdOnly = await prisma.inquiry.updateManyAndReturn({
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
    updateManyAndReturn<T extends InquiryUpdateManyAndReturnArgs>(args: SelectSubset<T, InquiryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Inquiry.
     * @param {InquiryUpsertArgs} args - Arguments to update or create a Inquiry.
     * @example
     * // Update or create a Inquiry
     * const inquiry = await prisma.inquiry.upsert({
     *   create: {
     *     // ... data to create a Inquiry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inquiry we want to update
     *   }
     * })
     */
    upsert<T extends InquiryUpsertArgs>(args: SelectSubset<T, InquiryUpsertArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Inquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryCountArgs} args - Arguments to filter Inquiries to count.
     * @example
     * // Count the number of Inquiries
     * const count = await prisma.inquiry.count({
     *   where: {
     *     // ... the filter for the Inquiries we want to count
     *   }
     * })
    **/
    count<T extends InquiryCountArgs>(
      args?: Subset<T, InquiryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InquiryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inquiry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InquiryAggregateArgs>(args: Subset<T, InquiryAggregateArgs>): Prisma.PrismaPromise<GetInquiryAggregateType<T>>

    /**
     * Group by Inquiry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryGroupByArgs} args - Group by arguments.
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
      T extends InquiryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InquiryGroupByArgs['orderBy'] }
        : { orderBy?: InquiryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InquiryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInquiryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inquiry model
   */
  readonly fields: InquiryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inquiry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InquiryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    replies<T extends Inquiry$repliesArgs<ExtArgs> = {}>(args?: Subset<T, Inquiry$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Inquiry model
   */
  interface InquiryFieldRefs {
    readonly id: FieldRef<"Inquiry", 'String'>
    readonly productId: FieldRef<"Inquiry", 'String'>
    readonly farmerId: FieldRef<"Inquiry", 'String'>
    readonly supplierId: FieldRef<"Inquiry", 'String'>
    readonly subject: FieldRef<"Inquiry", 'String'>
    readonly body: FieldRef<"Inquiry", 'String'>
    readonly status: FieldRef<"Inquiry", 'InquiryStatus'>
    readonly lastMessageAt: FieldRef<"Inquiry", 'DateTime'>
    readonly createdAt: FieldRef<"Inquiry", 'DateTime'>
    readonly updatedAt: FieldRef<"Inquiry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Inquiry findUnique
   */
  export type InquiryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry findUniqueOrThrow
   */
  export type InquiryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry findFirst
   */
  export type InquiryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inquiries.
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inquiries.
     */
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * Inquiry findFirstOrThrow
   */
  export type InquiryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter, which Inquiry to fetch.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inquiries.
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inquiries.
     */
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * Inquiry findMany
   */
  export type InquiryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter, which Inquiries to fetch.
     */
    where?: InquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inquiries to fetch.
     */
    orderBy?: InquiryOrderByWithRelationInput | InquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inquiries.
     */
    cursor?: InquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inquiries.
     */
    skip?: number
    distinct?: InquiryScalarFieldEnum | InquiryScalarFieldEnum[]
  }

  /**
   * Inquiry create
   */
  export type InquiryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * The data needed to create a Inquiry.
     */
    data: XOR<InquiryCreateInput, InquiryUncheckedCreateInput>
  }

  /**
   * Inquiry createMany
   */
  export type InquiryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inquiries.
     */
    data: InquiryCreateManyInput | InquiryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inquiry createManyAndReturn
   */
  export type InquiryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * The data used to create many Inquiries.
     */
    data: InquiryCreateManyInput | InquiryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inquiry update
   */
  export type InquiryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * The data needed to update a Inquiry.
     */
    data: XOR<InquiryUpdateInput, InquiryUncheckedUpdateInput>
    /**
     * Choose, which Inquiry to update.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry updateMany
   */
  export type InquiryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inquiries.
     */
    data: XOR<InquiryUpdateManyMutationInput, InquiryUncheckedUpdateManyInput>
    /**
     * Filter which Inquiries to update
     */
    where?: InquiryWhereInput
    /**
     * Limit how many Inquiries to update.
     */
    limit?: number
  }

  /**
   * Inquiry updateManyAndReturn
   */
  export type InquiryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * The data used to update Inquiries.
     */
    data: XOR<InquiryUpdateManyMutationInput, InquiryUncheckedUpdateManyInput>
    /**
     * Filter which Inquiries to update
     */
    where?: InquiryWhereInput
    /**
     * Limit how many Inquiries to update.
     */
    limit?: number
  }

  /**
   * Inquiry upsert
   */
  export type InquiryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * The filter to search for the Inquiry to update in case it exists.
     */
    where: InquiryWhereUniqueInput
    /**
     * In case the Inquiry found by the `where` argument doesn't exist, create a new Inquiry with this data.
     */
    create: XOR<InquiryCreateInput, InquiryUncheckedCreateInput>
    /**
     * In case the Inquiry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InquiryUpdateInput, InquiryUncheckedUpdateInput>
  }

  /**
   * Inquiry delete
   */
  export type InquiryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
    /**
     * Filter which Inquiry to delete.
     */
    where: InquiryWhereUniqueInput
  }

  /**
   * Inquiry deleteMany
   */
  export type InquiryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inquiries to delete
     */
    where?: InquiryWhereInput
    /**
     * Limit how many Inquiries to delete.
     */
    limit?: number
  }

  /**
   * Inquiry.replies
   */
  export type Inquiry$repliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyInclude<ExtArgs> | null
    where?: InquiryReplyWhereInput
    orderBy?: InquiryReplyOrderByWithRelationInput | InquiryReplyOrderByWithRelationInput[]
    cursor?: InquiryReplyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InquiryReplyScalarFieldEnum | InquiryReplyScalarFieldEnum[]
  }

  /**
   * Inquiry without action
   */
  export type InquiryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: InquirySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: InquiryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryInclude<ExtArgs> | null
  }


  /**
   * Model InquiryReply
   */

  export type AggregateInquiryReply = {
    _count: InquiryReplyCountAggregateOutputType | null
    _min: InquiryReplyMinAggregateOutputType | null
    _max: InquiryReplyMaxAggregateOutputType | null
  }

  export type InquiryReplyMinAggregateOutputType = {
    id: string | null
    inquiryId: string | null
    senderId: string | null
    senderRole: string | null
    message: string | null
    createdAt: Date | null
  }

  export type InquiryReplyMaxAggregateOutputType = {
    id: string | null
    inquiryId: string | null
    senderId: string | null
    senderRole: string | null
    message: string | null
    createdAt: Date | null
  }

  export type InquiryReplyCountAggregateOutputType = {
    id: number
    inquiryId: number
    senderId: number
    senderRole: number
    message: number
    createdAt: number
    _all: number
  }


  export type InquiryReplyMinAggregateInputType = {
    id?: true
    inquiryId?: true
    senderId?: true
    senderRole?: true
    message?: true
    createdAt?: true
  }

  export type InquiryReplyMaxAggregateInputType = {
    id?: true
    inquiryId?: true
    senderId?: true
    senderRole?: true
    message?: true
    createdAt?: true
  }

  export type InquiryReplyCountAggregateInputType = {
    id?: true
    inquiryId?: true
    senderId?: true
    senderRole?: true
    message?: true
    createdAt?: true
    _all?: true
  }

  export type InquiryReplyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InquiryReply to aggregate.
     */
    where?: InquiryReplyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InquiryReplies to fetch.
     */
    orderBy?: InquiryReplyOrderByWithRelationInput | InquiryReplyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InquiryReplyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InquiryReplies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InquiryReplies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InquiryReplies
    **/
    _count?: true | InquiryReplyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InquiryReplyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InquiryReplyMaxAggregateInputType
  }

  export type GetInquiryReplyAggregateType<T extends InquiryReplyAggregateArgs> = {
        [P in keyof T & keyof AggregateInquiryReply]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInquiryReply[P]>
      : GetScalarType<T[P], AggregateInquiryReply[P]>
  }




  export type InquiryReplyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InquiryReplyWhereInput
    orderBy?: InquiryReplyOrderByWithAggregationInput | InquiryReplyOrderByWithAggregationInput[]
    by: InquiryReplyScalarFieldEnum[] | InquiryReplyScalarFieldEnum
    having?: InquiryReplyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InquiryReplyCountAggregateInputType | true
    _min?: InquiryReplyMinAggregateInputType
    _max?: InquiryReplyMaxAggregateInputType
  }

  export type InquiryReplyGroupByOutputType = {
    id: string
    inquiryId: string
    senderId: string
    senderRole: string
    message: string
    createdAt: Date
    _count: InquiryReplyCountAggregateOutputType | null
    _min: InquiryReplyMinAggregateOutputType | null
    _max: InquiryReplyMaxAggregateOutputType | null
  }

  type GetInquiryReplyGroupByPayload<T extends InquiryReplyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InquiryReplyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InquiryReplyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InquiryReplyGroupByOutputType[P]>
            : GetScalarType<T[P], InquiryReplyGroupByOutputType[P]>
        }
      >
    >


  export type InquiryReplySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inquiryId?: boolean
    senderId?: boolean
    senderRole?: boolean
    message?: boolean
    createdAt?: boolean
    inquiry?: boolean | InquiryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inquiryReply"]>

  export type InquiryReplySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inquiryId?: boolean
    senderId?: boolean
    senderRole?: boolean
    message?: boolean
    createdAt?: boolean
    inquiry?: boolean | InquiryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inquiryReply"]>

  export type InquiryReplySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inquiryId?: boolean
    senderId?: boolean
    senderRole?: boolean
    message?: boolean
    createdAt?: boolean
    inquiry?: boolean | InquiryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inquiryReply"]>

  export type InquiryReplySelectScalar = {
    id?: boolean
    inquiryId?: boolean
    senderId?: boolean
    senderRole?: boolean
    message?: boolean
    createdAt?: boolean
  }

  export type InquiryReplyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "inquiryId" | "senderId" | "senderRole" | "message" | "createdAt", ExtArgs["result"]["inquiryReply"]>
  export type InquiryReplyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inquiry?: boolean | InquiryDefaultArgs<ExtArgs>
  }
  export type InquiryReplyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inquiry?: boolean | InquiryDefaultArgs<ExtArgs>
  }
  export type InquiryReplyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inquiry?: boolean | InquiryDefaultArgs<ExtArgs>
  }

  export type $InquiryReplyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InquiryReply"
    objects: {
      inquiry: Prisma.$InquiryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      inquiryId: string
      senderId: string
      senderRole: string
      message: string
      createdAt: Date
    }, ExtArgs["result"]["inquiryReply"]>
    composites: {}
  }

  type InquiryReplyGetPayload<S extends boolean | null | undefined | InquiryReplyDefaultArgs> = $Result.GetResult<Prisma.$InquiryReplyPayload, S>

  type InquiryReplyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InquiryReplyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InquiryReplyCountAggregateInputType | true
    }

  export interface InquiryReplyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InquiryReply'], meta: { name: 'InquiryReply' } }
    /**
     * Find zero or one InquiryReply that matches the filter.
     * @param {InquiryReplyFindUniqueArgs} args - Arguments to find a InquiryReply
     * @example
     * // Get one InquiryReply
     * const inquiryReply = await prisma.inquiryReply.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InquiryReplyFindUniqueArgs>(args: SelectSubset<T, InquiryReplyFindUniqueArgs<ExtArgs>>): Prisma__InquiryReplyClient<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InquiryReply that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InquiryReplyFindUniqueOrThrowArgs} args - Arguments to find a InquiryReply
     * @example
     * // Get one InquiryReply
     * const inquiryReply = await prisma.inquiryReply.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InquiryReplyFindUniqueOrThrowArgs>(args: SelectSubset<T, InquiryReplyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InquiryReplyClient<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InquiryReply that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryReplyFindFirstArgs} args - Arguments to find a InquiryReply
     * @example
     * // Get one InquiryReply
     * const inquiryReply = await prisma.inquiryReply.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InquiryReplyFindFirstArgs>(args?: SelectSubset<T, InquiryReplyFindFirstArgs<ExtArgs>>): Prisma__InquiryReplyClient<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InquiryReply that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryReplyFindFirstOrThrowArgs} args - Arguments to find a InquiryReply
     * @example
     * // Get one InquiryReply
     * const inquiryReply = await prisma.inquiryReply.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InquiryReplyFindFirstOrThrowArgs>(args?: SelectSubset<T, InquiryReplyFindFirstOrThrowArgs<ExtArgs>>): Prisma__InquiryReplyClient<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InquiryReplies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryReplyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InquiryReplies
     * const inquiryReplies = await prisma.inquiryReply.findMany()
     * 
     * // Get first 10 InquiryReplies
     * const inquiryReplies = await prisma.inquiryReply.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inquiryReplyWithIdOnly = await prisma.inquiryReply.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InquiryReplyFindManyArgs>(args?: SelectSubset<T, InquiryReplyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InquiryReply.
     * @param {InquiryReplyCreateArgs} args - Arguments to create a InquiryReply.
     * @example
     * // Create one InquiryReply
     * const InquiryReply = await prisma.inquiryReply.create({
     *   data: {
     *     // ... data to create a InquiryReply
     *   }
     * })
     * 
     */
    create<T extends InquiryReplyCreateArgs>(args: SelectSubset<T, InquiryReplyCreateArgs<ExtArgs>>): Prisma__InquiryReplyClient<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InquiryReplies.
     * @param {InquiryReplyCreateManyArgs} args - Arguments to create many InquiryReplies.
     * @example
     * // Create many InquiryReplies
     * const inquiryReply = await prisma.inquiryReply.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InquiryReplyCreateManyArgs>(args?: SelectSubset<T, InquiryReplyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InquiryReplies and returns the data saved in the database.
     * @param {InquiryReplyCreateManyAndReturnArgs} args - Arguments to create many InquiryReplies.
     * @example
     * // Create many InquiryReplies
     * const inquiryReply = await prisma.inquiryReply.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InquiryReplies and only return the `id`
     * const inquiryReplyWithIdOnly = await prisma.inquiryReply.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InquiryReplyCreateManyAndReturnArgs>(args?: SelectSubset<T, InquiryReplyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InquiryReply.
     * @param {InquiryReplyDeleteArgs} args - Arguments to delete one InquiryReply.
     * @example
     * // Delete one InquiryReply
     * const InquiryReply = await prisma.inquiryReply.delete({
     *   where: {
     *     // ... filter to delete one InquiryReply
     *   }
     * })
     * 
     */
    delete<T extends InquiryReplyDeleteArgs>(args: SelectSubset<T, InquiryReplyDeleteArgs<ExtArgs>>): Prisma__InquiryReplyClient<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InquiryReply.
     * @param {InquiryReplyUpdateArgs} args - Arguments to update one InquiryReply.
     * @example
     * // Update one InquiryReply
     * const inquiryReply = await prisma.inquiryReply.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InquiryReplyUpdateArgs>(args: SelectSubset<T, InquiryReplyUpdateArgs<ExtArgs>>): Prisma__InquiryReplyClient<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InquiryReplies.
     * @param {InquiryReplyDeleteManyArgs} args - Arguments to filter InquiryReplies to delete.
     * @example
     * // Delete a few InquiryReplies
     * const { count } = await prisma.inquiryReply.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InquiryReplyDeleteManyArgs>(args?: SelectSubset<T, InquiryReplyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InquiryReplies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryReplyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InquiryReplies
     * const inquiryReply = await prisma.inquiryReply.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InquiryReplyUpdateManyArgs>(args: SelectSubset<T, InquiryReplyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InquiryReplies and returns the data updated in the database.
     * @param {InquiryReplyUpdateManyAndReturnArgs} args - Arguments to update many InquiryReplies.
     * @example
     * // Update many InquiryReplies
     * const inquiryReply = await prisma.inquiryReply.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InquiryReplies and only return the `id`
     * const inquiryReplyWithIdOnly = await prisma.inquiryReply.updateManyAndReturn({
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
    updateManyAndReturn<T extends InquiryReplyUpdateManyAndReturnArgs>(args: SelectSubset<T, InquiryReplyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InquiryReply.
     * @param {InquiryReplyUpsertArgs} args - Arguments to update or create a InquiryReply.
     * @example
     * // Update or create a InquiryReply
     * const inquiryReply = await prisma.inquiryReply.upsert({
     *   create: {
     *     // ... data to create a InquiryReply
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InquiryReply we want to update
     *   }
     * })
     */
    upsert<T extends InquiryReplyUpsertArgs>(args: SelectSubset<T, InquiryReplyUpsertArgs<ExtArgs>>): Prisma__InquiryReplyClient<$Result.GetResult<Prisma.$InquiryReplyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InquiryReplies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryReplyCountArgs} args - Arguments to filter InquiryReplies to count.
     * @example
     * // Count the number of InquiryReplies
     * const count = await prisma.inquiryReply.count({
     *   where: {
     *     // ... the filter for the InquiryReplies we want to count
     *   }
     * })
    **/
    count<T extends InquiryReplyCountArgs>(
      args?: Subset<T, InquiryReplyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InquiryReplyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InquiryReply.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryReplyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InquiryReplyAggregateArgs>(args: Subset<T, InquiryReplyAggregateArgs>): Prisma.PrismaPromise<GetInquiryReplyAggregateType<T>>

    /**
     * Group by InquiryReply.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryReplyGroupByArgs} args - Group by arguments.
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
      T extends InquiryReplyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InquiryReplyGroupByArgs['orderBy'] }
        : { orderBy?: InquiryReplyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InquiryReplyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInquiryReplyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InquiryReply model
   */
  readonly fields: InquiryReplyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InquiryReply.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InquiryReplyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    inquiry<T extends InquiryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InquiryDefaultArgs<ExtArgs>>): Prisma__InquiryClient<$Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the InquiryReply model
   */
  interface InquiryReplyFieldRefs {
    readonly id: FieldRef<"InquiryReply", 'String'>
    readonly inquiryId: FieldRef<"InquiryReply", 'String'>
    readonly senderId: FieldRef<"InquiryReply", 'String'>
    readonly senderRole: FieldRef<"InquiryReply", 'String'>
    readonly message: FieldRef<"InquiryReply", 'String'>
    readonly createdAt: FieldRef<"InquiryReply", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InquiryReply findUnique
   */
  export type InquiryReplyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyInclude<ExtArgs> | null
    /**
     * Filter, which InquiryReply to fetch.
     */
    where: InquiryReplyWhereUniqueInput
  }

  /**
   * InquiryReply findUniqueOrThrow
   */
  export type InquiryReplyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyInclude<ExtArgs> | null
    /**
     * Filter, which InquiryReply to fetch.
     */
    where: InquiryReplyWhereUniqueInput
  }

  /**
   * InquiryReply findFirst
   */
  export type InquiryReplyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyInclude<ExtArgs> | null
    /**
     * Filter, which InquiryReply to fetch.
     */
    where?: InquiryReplyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InquiryReplies to fetch.
     */
    orderBy?: InquiryReplyOrderByWithRelationInput | InquiryReplyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InquiryReplies.
     */
    cursor?: InquiryReplyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InquiryReplies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InquiryReplies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InquiryReplies.
     */
    distinct?: InquiryReplyScalarFieldEnum | InquiryReplyScalarFieldEnum[]
  }

  /**
   * InquiryReply findFirstOrThrow
   */
  export type InquiryReplyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyInclude<ExtArgs> | null
    /**
     * Filter, which InquiryReply to fetch.
     */
    where?: InquiryReplyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InquiryReplies to fetch.
     */
    orderBy?: InquiryReplyOrderByWithRelationInput | InquiryReplyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InquiryReplies.
     */
    cursor?: InquiryReplyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InquiryReplies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InquiryReplies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InquiryReplies.
     */
    distinct?: InquiryReplyScalarFieldEnum | InquiryReplyScalarFieldEnum[]
  }

  /**
   * InquiryReply findMany
   */
  export type InquiryReplyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyInclude<ExtArgs> | null
    /**
     * Filter, which InquiryReplies to fetch.
     */
    where?: InquiryReplyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InquiryReplies to fetch.
     */
    orderBy?: InquiryReplyOrderByWithRelationInput | InquiryReplyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InquiryReplies.
     */
    cursor?: InquiryReplyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InquiryReplies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InquiryReplies.
     */
    skip?: number
    distinct?: InquiryReplyScalarFieldEnum | InquiryReplyScalarFieldEnum[]
  }

  /**
   * InquiryReply create
   */
  export type InquiryReplyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyInclude<ExtArgs> | null
    /**
     * The data needed to create a InquiryReply.
     */
    data: XOR<InquiryReplyCreateInput, InquiryReplyUncheckedCreateInput>
  }

  /**
   * InquiryReply createMany
   */
  export type InquiryReplyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InquiryReplies.
     */
    data: InquiryReplyCreateManyInput | InquiryReplyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InquiryReply createManyAndReturn
   */
  export type InquiryReplyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * The data used to create many InquiryReplies.
     */
    data: InquiryReplyCreateManyInput | InquiryReplyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InquiryReply update
   */
  export type InquiryReplyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyInclude<ExtArgs> | null
    /**
     * The data needed to update a InquiryReply.
     */
    data: XOR<InquiryReplyUpdateInput, InquiryReplyUncheckedUpdateInput>
    /**
     * Choose, which InquiryReply to update.
     */
    where: InquiryReplyWhereUniqueInput
  }

  /**
   * InquiryReply updateMany
   */
  export type InquiryReplyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InquiryReplies.
     */
    data: XOR<InquiryReplyUpdateManyMutationInput, InquiryReplyUncheckedUpdateManyInput>
    /**
     * Filter which InquiryReplies to update
     */
    where?: InquiryReplyWhereInput
    /**
     * Limit how many InquiryReplies to update.
     */
    limit?: number
  }

  /**
   * InquiryReply updateManyAndReturn
   */
  export type InquiryReplyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * The data used to update InquiryReplies.
     */
    data: XOR<InquiryReplyUpdateManyMutationInput, InquiryReplyUncheckedUpdateManyInput>
    /**
     * Filter which InquiryReplies to update
     */
    where?: InquiryReplyWhereInput
    /**
     * Limit how many InquiryReplies to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InquiryReply upsert
   */
  export type InquiryReplyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyInclude<ExtArgs> | null
    /**
     * The filter to search for the InquiryReply to update in case it exists.
     */
    where: InquiryReplyWhereUniqueInput
    /**
     * In case the InquiryReply found by the `where` argument doesn't exist, create a new InquiryReply with this data.
     */
    create: XOR<InquiryReplyCreateInput, InquiryReplyUncheckedCreateInput>
    /**
     * In case the InquiryReply was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InquiryReplyUpdateInput, InquiryReplyUncheckedUpdateInput>
  }

  /**
   * InquiryReply delete
   */
  export type InquiryReplyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyInclude<ExtArgs> | null
    /**
     * Filter which InquiryReply to delete.
     */
    where: InquiryReplyWhereUniqueInput
  }

  /**
   * InquiryReply deleteMany
   */
  export type InquiryReplyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InquiryReplies to delete
     */
    where?: InquiryReplyWhereInput
    /**
     * Limit how many InquiryReplies to delete.
     */
    limit?: number
  }

  /**
   * InquiryReply without action
   */
  export type InquiryReplyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryReply
     */
    select?: InquiryReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InquiryReply
     */
    omit?: InquiryReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InquiryReplyInclude<ExtArgs> | null
  }


  /**
   * Model CommunityDeal
   */

  export type AggregateCommunityDeal = {
    _count: CommunityDealCountAggregateOutputType | null
    _avg: CommunityDealAvgAggregateOutputType | null
    _sum: CommunityDealSumAggregateOutputType | null
    _min: CommunityDealMinAggregateOutputType | null
    _max: CommunityDealMaxAggregateOutputType | null
  }

  export type CommunityDealAvgAggregateOutputType = {
    targetQuantity: number | null
    currentQuantity: number | null
    originalPricePaise: number | null
    dealPricePaise: number | null
  }

  export type CommunityDealSumAggregateOutputType = {
    targetQuantity: number | null
    currentQuantity: number | null
    originalPricePaise: number | null
    dealPricePaise: number | null
  }

  export type CommunityDealMinAggregateOutputType = {
    id: string | null
    productId: string | null
    supplierId: string | null
    title: string | null
    description: string | null
    targetQuantity: number | null
    currentQuantity: number | null
    originalPricePaise: number | null
    dealPricePaise: number | null
    endsAt: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommunityDealMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    supplierId: string | null
    title: string | null
    description: string | null
    targetQuantity: number | null
    currentQuantity: number | null
    originalPricePaise: number | null
    dealPricePaise: number | null
    endsAt: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommunityDealCountAggregateOutputType = {
    id: number
    productId: number
    supplierId: number
    title: number
    description: number
    targetQuantity: number
    currentQuantity: number
    originalPricePaise: number
    dealPricePaise: number
    endsAt: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CommunityDealAvgAggregateInputType = {
    targetQuantity?: true
    currentQuantity?: true
    originalPricePaise?: true
    dealPricePaise?: true
  }

  export type CommunityDealSumAggregateInputType = {
    targetQuantity?: true
    currentQuantity?: true
    originalPricePaise?: true
    dealPricePaise?: true
  }

  export type CommunityDealMinAggregateInputType = {
    id?: true
    productId?: true
    supplierId?: true
    title?: true
    description?: true
    targetQuantity?: true
    currentQuantity?: true
    originalPricePaise?: true
    dealPricePaise?: true
    endsAt?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommunityDealMaxAggregateInputType = {
    id?: true
    productId?: true
    supplierId?: true
    title?: true
    description?: true
    targetQuantity?: true
    currentQuantity?: true
    originalPricePaise?: true
    dealPricePaise?: true
    endsAt?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommunityDealCountAggregateInputType = {
    id?: true
    productId?: true
    supplierId?: true
    title?: true
    description?: true
    targetQuantity?: true
    currentQuantity?: true
    originalPricePaise?: true
    dealPricePaise?: true
    endsAt?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CommunityDealAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityDeal to aggregate.
     */
    where?: CommunityDealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityDeals to fetch.
     */
    orderBy?: CommunityDealOrderByWithRelationInput | CommunityDealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommunityDealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityDeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityDeals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommunityDeals
    **/
    _count?: true | CommunityDealCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CommunityDealAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CommunityDealSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommunityDealMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommunityDealMaxAggregateInputType
  }

  export type GetCommunityDealAggregateType<T extends CommunityDealAggregateArgs> = {
        [P in keyof T & keyof AggregateCommunityDeal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommunityDeal[P]>
      : GetScalarType<T[P], AggregateCommunityDeal[P]>
  }




  export type CommunityDealGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityDealWhereInput
    orderBy?: CommunityDealOrderByWithAggregationInput | CommunityDealOrderByWithAggregationInput[]
    by: CommunityDealScalarFieldEnum[] | CommunityDealScalarFieldEnum
    having?: CommunityDealScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommunityDealCountAggregateInputType | true
    _avg?: CommunityDealAvgAggregateInputType
    _sum?: CommunityDealSumAggregateInputType
    _min?: CommunityDealMinAggregateInputType
    _max?: CommunityDealMaxAggregateInputType
  }

  export type CommunityDealGroupByOutputType = {
    id: string
    productId: string
    supplierId: string
    title: string
    description: string
    targetQuantity: number
    currentQuantity: number
    originalPricePaise: number
    dealPricePaise: number
    endsAt: Date
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: CommunityDealCountAggregateOutputType | null
    _avg: CommunityDealAvgAggregateOutputType | null
    _sum: CommunityDealSumAggregateOutputType | null
    _min: CommunityDealMinAggregateOutputType | null
    _max: CommunityDealMaxAggregateOutputType | null
  }

  type GetCommunityDealGroupByPayload<T extends CommunityDealGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommunityDealGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommunityDealGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommunityDealGroupByOutputType[P]>
            : GetScalarType<T[P], CommunityDealGroupByOutputType[P]>
        }
      >
    >


  export type CommunityDealSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    title?: boolean
    description?: boolean
    targetQuantity?: boolean
    currentQuantity?: boolean
    originalPricePaise?: boolean
    dealPricePaise?: boolean
    endsAt?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    participants?: boolean | CommunityDeal$participantsArgs<ExtArgs>
    _count?: boolean | CommunityDealCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["communityDeal"]>

  export type CommunityDealSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    title?: boolean
    description?: boolean
    targetQuantity?: boolean
    currentQuantity?: boolean
    originalPricePaise?: boolean
    dealPricePaise?: boolean
    endsAt?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["communityDeal"]>

  export type CommunityDealSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    title?: boolean
    description?: boolean
    targetQuantity?: boolean
    currentQuantity?: boolean
    originalPricePaise?: boolean
    dealPricePaise?: boolean
    endsAt?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["communityDeal"]>

  export type CommunityDealSelectScalar = {
    id?: boolean
    productId?: boolean
    supplierId?: boolean
    title?: boolean
    description?: boolean
    targetQuantity?: boolean
    currentQuantity?: boolean
    originalPricePaise?: boolean
    dealPricePaise?: boolean
    endsAt?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CommunityDealOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "supplierId" | "title" | "description" | "targetQuantity" | "currentQuantity" | "originalPricePaise" | "dealPricePaise" | "endsAt" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["communityDeal"]>
  export type CommunityDealInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | CommunityDeal$participantsArgs<ExtArgs>
    _count?: boolean | CommunityDealCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CommunityDealIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CommunityDealIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CommunityDealPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommunityDeal"
    objects: {
      participants: Prisma.$DealParticipantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      supplierId: string
      title: string
      description: string
      targetQuantity: number
      currentQuantity: number
      originalPricePaise: number
      dealPricePaise: number
      endsAt: Date
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["communityDeal"]>
    composites: {}
  }

  type CommunityDealGetPayload<S extends boolean | null | undefined | CommunityDealDefaultArgs> = $Result.GetResult<Prisma.$CommunityDealPayload, S>

  type CommunityDealCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CommunityDealFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommunityDealCountAggregateInputType | true
    }

  export interface CommunityDealDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommunityDeal'], meta: { name: 'CommunityDeal' } }
    /**
     * Find zero or one CommunityDeal that matches the filter.
     * @param {CommunityDealFindUniqueArgs} args - Arguments to find a CommunityDeal
     * @example
     * // Get one CommunityDeal
     * const communityDeal = await prisma.communityDeal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommunityDealFindUniqueArgs>(args: SelectSubset<T, CommunityDealFindUniqueArgs<ExtArgs>>): Prisma__CommunityDealClient<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CommunityDeal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommunityDealFindUniqueOrThrowArgs} args - Arguments to find a CommunityDeal
     * @example
     * // Get one CommunityDeal
     * const communityDeal = await prisma.communityDeal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommunityDealFindUniqueOrThrowArgs>(args: SelectSubset<T, CommunityDealFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommunityDealClient<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CommunityDeal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityDealFindFirstArgs} args - Arguments to find a CommunityDeal
     * @example
     * // Get one CommunityDeal
     * const communityDeal = await prisma.communityDeal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommunityDealFindFirstArgs>(args?: SelectSubset<T, CommunityDealFindFirstArgs<ExtArgs>>): Prisma__CommunityDealClient<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CommunityDeal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityDealFindFirstOrThrowArgs} args - Arguments to find a CommunityDeal
     * @example
     * // Get one CommunityDeal
     * const communityDeal = await prisma.communityDeal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommunityDealFindFirstOrThrowArgs>(args?: SelectSubset<T, CommunityDealFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommunityDealClient<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CommunityDeals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityDealFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommunityDeals
     * const communityDeals = await prisma.communityDeal.findMany()
     * 
     * // Get first 10 CommunityDeals
     * const communityDeals = await prisma.communityDeal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const communityDealWithIdOnly = await prisma.communityDeal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommunityDealFindManyArgs>(args?: SelectSubset<T, CommunityDealFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CommunityDeal.
     * @param {CommunityDealCreateArgs} args - Arguments to create a CommunityDeal.
     * @example
     * // Create one CommunityDeal
     * const CommunityDeal = await prisma.communityDeal.create({
     *   data: {
     *     // ... data to create a CommunityDeal
     *   }
     * })
     * 
     */
    create<T extends CommunityDealCreateArgs>(args: SelectSubset<T, CommunityDealCreateArgs<ExtArgs>>): Prisma__CommunityDealClient<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CommunityDeals.
     * @param {CommunityDealCreateManyArgs} args - Arguments to create many CommunityDeals.
     * @example
     * // Create many CommunityDeals
     * const communityDeal = await prisma.communityDeal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommunityDealCreateManyArgs>(args?: SelectSubset<T, CommunityDealCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CommunityDeals and returns the data saved in the database.
     * @param {CommunityDealCreateManyAndReturnArgs} args - Arguments to create many CommunityDeals.
     * @example
     * // Create many CommunityDeals
     * const communityDeal = await prisma.communityDeal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CommunityDeals and only return the `id`
     * const communityDealWithIdOnly = await prisma.communityDeal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommunityDealCreateManyAndReturnArgs>(args?: SelectSubset<T, CommunityDealCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CommunityDeal.
     * @param {CommunityDealDeleteArgs} args - Arguments to delete one CommunityDeal.
     * @example
     * // Delete one CommunityDeal
     * const CommunityDeal = await prisma.communityDeal.delete({
     *   where: {
     *     // ... filter to delete one CommunityDeal
     *   }
     * })
     * 
     */
    delete<T extends CommunityDealDeleteArgs>(args: SelectSubset<T, CommunityDealDeleteArgs<ExtArgs>>): Prisma__CommunityDealClient<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CommunityDeal.
     * @param {CommunityDealUpdateArgs} args - Arguments to update one CommunityDeal.
     * @example
     * // Update one CommunityDeal
     * const communityDeal = await prisma.communityDeal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommunityDealUpdateArgs>(args: SelectSubset<T, CommunityDealUpdateArgs<ExtArgs>>): Prisma__CommunityDealClient<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CommunityDeals.
     * @param {CommunityDealDeleteManyArgs} args - Arguments to filter CommunityDeals to delete.
     * @example
     * // Delete a few CommunityDeals
     * const { count } = await prisma.communityDeal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommunityDealDeleteManyArgs>(args?: SelectSubset<T, CommunityDealDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunityDeals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityDealUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommunityDeals
     * const communityDeal = await prisma.communityDeal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommunityDealUpdateManyArgs>(args: SelectSubset<T, CommunityDealUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunityDeals and returns the data updated in the database.
     * @param {CommunityDealUpdateManyAndReturnArgs} args - Arguments to update many CommunityDeals.
     * @example
     * // Update many CommunityDeals
     * const communityDeal = await prisma.communityDeal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CommunityDeals and only return the `id`
     * const communityDealWithIdOnly = await prisma.communityDeal.updateManyAndReturn({
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
    updateManyAndReturn<T extends CommunityDealUpdateManyAndReturnArgs>(args: SelectSubset<T, CommunityDealUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CommunityDeal.
     * @param {CommunityDealUpsertArgs} args - Arguments to update or create a CommunityDeal.
     * @example
     * // Update or create a CommunityDeal
     * const communityDeal = await prisma.communityDeal.upsert({
     *   create: {
     *     // ... data to create a CommunityDeal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommunityDeal we want to update
     *   }
     * })
     */
    upsert<T extends CommunityDealUpsertArgs>(args: SelectSubset<T, CommunityDealUpsertArgs<ExtArgs>>): Prisma__CommunityDealClient<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CommunityDeals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityDealCountArgs} args - Arguments to filter CommunityDeals to count.
     * @example
     * // Count the number of CommunityDeals
     * const count = await prisma.communityDeal.count({
     *   where: {
     *     // ... the filter for the CommunityDeals we want to count
     *   }
     * })
    **/
    count<T extends CommunityDealCountArgs>(
      args?: Subset<T, CommunityDealCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommunityDealCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommunityDeal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityDealAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CommunityDealAggregateArgs>(args: Subset<T, CommunityDealAggregateArgs>): Prisma.PrismaPromise<GetCommunityDealAggregateType<T>>

    /**
     * Group by CommunityDeal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityDealGroupByArgs} args - Group by arguments.
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
      T extends CommunityDealGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommunityDealGroupByArgs['orderBy'] }
        : { orderBy?: CommunityDealGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CommunityDealGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommunityDealGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CommunityDeal model
   */
  readonly fields: CommunityDealFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CommunityDeal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommunityDealClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participants<T extends CommunityDeal$participantsArgs<ExtArgs> = {}>(args?: Subset<T, CommunityDeal$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the CommunityDeal model
   */
  interface CommunityDealFieldRefs {
    readonly id: FieldRef<"CommunityDeal", 'String'>
    readonly productId: FieldRef<"CommunityDeal", 'String'>
    readonly supplierId: FieldRef<"CommunityDeal", 'String'>
    readonly title: FieldRef<"CommunityDeal", 'String'>
    readonly description: FieldRef<"CommunityDeal", 'String'>
    readonly targetQuantity: FieldRef<"CommunityDeal", 'Int'>
    readonly currentQuantity: FieldRef<"CommunityDeal", 'Int'>
    readonly originalPricePaise: FieldRef<"CommunityDeal", 'Int'>
    readonly dealPricePaise: FieldRef<"CommunityDeal", 'Int'>
    readonly endsAt: FieldRef<"CommunityDeal", 'DateTime'>
    readonly isActive: FieldRef<"CommunityDeal", 'Boolean'>
    readonly createdAt: FieldRef<"CommunityDeal", 'DateTime'>
    readonly updatedAt: FieldRef<"CommunityDeal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CommunityDeal findUnique
   */
  export type CommunityDealFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityDealInclude<ExtArgs> | null
    /**
     * Filter, which CommunityDeal to fetch.
     */
    where: CommunityDealWhereUniqueInput
  }

  /**
   * CommunityDeal findUniqueOrThrow
   */
  export type CommunityDealFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityDealInclude<ExtArgs> | null
    /**
     * Filter, which CommunityDeal to fetch.
     */
    where: CommunityDealWhereUniqueInput
  }

  /**
   * CommunityDeal findFirst
   */
  export type CommunityDealFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityDealInclude<ExtArgs> | null
    /**
     * Filter, which CommunityDeal to fetch.
     */
    where?: CommunityDealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityDeals to fetch.
     */
    orderBy?: CommunityDealOrderByWithRelationInput | CommunityDealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityDeals.
     */
    cursor?: CommunityDealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityDeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityDeals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityDeals.
     */
    distinct?: CommunityDealScalarFieldEnum | CommunityDealScalarFieldEnum[]
  }

  /**
   * CommunityDeal findFirstOrThrow
   */
  export type CommunityDealFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityDealInclude<ExtArgs> | null
    /**
     * Filter, which CommunityDeal to fetch.
     */
    where?: CommunityDealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityDeals to fetch.
     */
    orderBy?: CommunityDealOrderByWithRelationInput | CommunityDealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityDeals.
     */
    cursor?: CommunityDealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityDeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityDeals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityDeals.
     */
    distinct?: CommunityDealScalarFieldEnum | CommunityDealScalarFieldEnum[]
  }

  /**
   * CommunityDeal findMany
   */
  export type CommunityDealFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityDealInclude<ExtArgs> | null
    /**
     * Filter, which CommunityDeals to fetch.
     */
    where?: CommunityDealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityDeals to fetch.
     */
    orderBy?: CommunityDealOrderByWithRelationInput | CommunityDealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommunityDeals.
     */
    cursor?: CommunityDealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityDeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityDeals.
     */
    skip?: number
    distinct?: CommunityDealScalarFieldEnum | CommunityDealScalarFieldEnum[]
  }

  /**
   * CommunityDeal create
   */
  export type CommunityDealCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityDealInclude<ExtArgs> | null
    /**
     * The data needed to create a CommunityDeal.
     */
    data: XOR<CommunityDealCreateInput, CommunityDealUncheckedCreateInput>
  }

  /**
   * CommunityDeal createMany
   */
  export type CommunityDealCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommunityDeals.
     */
    data: CommunityDealCreateManyInput | CommunityDealCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityDeal createManyAndReturn
   */
  export type CommunityDealCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * The data used to create many CommunityDeals.
     */
    data: CommunityDealCreateManyInput | CommunityDealCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityDeal update
   */
  export type CommunityDealUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityDealInclude<ExtArgs> | null
    /**
     * The data needed to update a CommunityDeal.
     */
    data: XOR<CommunityDealUpdateInput, CommunityDealUncheckedUpdateInput>
    /**
     * Choose, which CommunityDeal to update.
     */
    where: CommunityDealWhereUniqueInput
  }

  /**
   * CommunityDeal updateMany
   */
  export type CommunityDealUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommunityDeals.
     */
    data: XOR<CommunityDealUpdateManyMutationInput, CommunityDealUncheckedUpdateManyInput>
    /**
     * Filter which CommunityDeals to update
     */
    where?: CommunityDealWhereInput
    /**
     * Limit how many CommunityDeals to update.
     */
    limit?: number
  }

  /**
   * CommunityDeal updateManyAndReturn
   */
  export type CommunityDealUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * The data used to update CommunityDeals.
     */
    data: XOR<CommunityDealUpdateManyMutationInput, CommunityDealUncheckedUpdateManyInput>
    /**
     * Filter which CommunityDeals to update
     */
    where?: CommunityDealWhereInput
    /**
     * Limit how many CommunityDeals to update.
     */
    limit?: number
  }

  /**
   * CommunityDeal upsert
   */
  export type CommunityDealUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityDealInclude<ExtArgs> | null
    /**
     * The filter to search for the CommunityDeal to update in case it exists.
     */
    where: CommunityDealWhereUniqueInput
    /**
     * In case the CommunityDeal found by the `where` argument doesn't exist, create a new CommunityDeal with this data.
     */
    create: XOR<CommunityDealCreateInput, CommunityDealUncheckedCreateInput>
    /**
     * In case the CommunityDeal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommunityDealUpdateInput, CommunityDealUncheckedUpdateInput>
  }

  /**
   * CommunityDeal delete
   */
  export type CommunityDealDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityDealInclude<ExtArgs> | null
    /**
     * Filter which CommunityDeal to delete.
     */
    where: CommunityDealWhereUniqueInput
  }

  /**
   * CommunityDeal deleteMany
   */
  export type CommunityDealDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityDeals to delete
     */
    where?: CommunityDealWhereInput
    /**
     * Limit how many CommunityDeals to delete.
     */
    limit?: number
  }

  /**
   * CommunityDeal.participants
   */
  export type CommunityDeal$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantInclude<ExtArgs> | null
    where?: DealParticipantWhereInput
    orderBy?: DealParticipantOrderByWithRelationInput | DealParticipantOrderByWithRelationInput[]
    cursor?: DealParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DealParticipantScalarFieldEnum | DealParticipantScalarFieldEnum[]
  }

  /**
   * CommunityDeal without action
   */
  export type CommunityDealDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityDeal
     */
    select?: CommunityDealSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CommunityDeal
     */
    omit?: CommunityDealOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityDealInclude<ExtArgs> | null
  }


  /**
   * Model DealParticipant
   */

  export type AggregateDealParticipant = {
    _count: DealParticipantCountAggregateOutputType | null
    _avg: DealParticipantAvgAggregateOutputType | null
    _sum: DealParticipantSumAggregateOutputType | null
    _min: DealParticipantMinAggregateOutputType | null
    _max: DealParticipantMaxAggregateOutputType | null
  }

  export type DealParticipantAvgAggregateOutputType = {
    quantity: number | null
  }

  export type DealParticipantSumAggregateOutputType = {
    quantity: number | null
  }

  export type DealParticipantMinAggregateOutputType = {
    id: string | null
    dealId: string | null
    farmerId: string | null
    quantity: number | null
    paymentStatus: $Enums.PaymentStatus | null
    orderId: string | null
    createdAt: Date | null
  }

  export type DealParticipantMaxAggregateOutputType = {
    id: string | null
    dealId: string | null
    farmerId: string | null
    quantity: number | null
    paymentStatus: $Enums.PaymentStatus | null
    orderId: string | null
    createdAt: Date | null
  }

  export type DealParticipantCountAggregateOutputType = {
    id: number
    dealId: number
    farmerId: number
    quantity: number
    paymentStatus: number
    orderId: number
    createdAt: number
    _all: number
  }


  export type DealParticipantAvgAggregateInputType = {
    quantity?: true
  }

  export type DealParticipantSumAggregateInputType = {
    quantity?: true
  }

  export type DealParticipantMinAggregateInputType = {
    id?: true
    dealId?: true
    farmerId?: true
    quantity?: true
    paymentStatus?: true
    orderId?: true
    createdAt?: true
  }

  export type DealParticipantMaxAggregateInputType = {
    id?: true
    dealId?: true
    farmerId?: true
    quantity?: true
    paymentStatus?: true
    orderId?: true
    createdAt?: true
  }

  export type DealParticipantCountAggregateInputType = {
    id?: true
    dealId?: true
    farmerId?: true
    quantity?: true
    paymentStatus?: true
    orderId?: true
    createdAt?: true
    _all?: true
  }

  export type DealParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DealParticipant to aggregate.
     */
    where?: DealParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DealParticipants to fetch.
     */
    orderBy?: DealParticipantOrderByWithRelationInput | DealParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DealParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DealParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DealParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DealParticipants
    **/
    _count?: true | DealParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DealParticipantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DealParticipantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DealParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DealParticipantMaxAggregateInputType
  }

  export type GetDealParticipantAggregateType<T extends DealParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateDealParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDealParticipant[P]>
      : GetScalarType<T[P], AggregateDealParticipant[P]>
  }




  export type DealParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DealParticipantWhereInput
    orderBy?: DealParticipantOrderByWithAggregationInput | DealParticipantOrderByWithAggregationInput[]
    by: DealParticipantScalarFieldEnum[] | DealParticipantScalarFieldEnum
    having?: DealParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DealParticipantCountAggregateInputType | true
    _avg?: DealParticipantAvgAggregateInputType
    _sum?: DealParticipantSumAggregateInputType
    _min?: DealParticipantMinAggregateInputType
    _max?: DealParticipantMaxAggregateInputType
  }

  export type DealParticipantGroupByOutputType = {
    id: string
    dealId: string
    farmerId: string
    quantity: number
    paymentStatus: $Enums.PaymentStatus
    orderId: string | null
    createdAt: Date
    _count: DealParticipantCountAggregateOutputType | null
    _avg: DealParticipantAvgAggregateOutputType | null
    _sum: DealParticipantSumAggregateOutputType | null
    _min: DealParticipantMinAggregateOutputType | null
    _max: DealParticipantMaxAggregateOutputType | null
  }

  type GetDealParticipantGroupByPayload<T extends DealParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DealParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DealParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DealParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], DealParticipantGroupByOutputType[P]>
        }
      >
    >


  export type DealParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dealId?: boolean
    farmerId?: boolean
    quantity?: boolean
    paymentStatus?: boolean
    orderId?: boolean
    createdAt?: boolean
    deal?: boolean | CommunityDealDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dealParticipant"]>

  export type DealParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dealId?: boolean
    farmerId?: boolean
    quantity?: boolean
    paymentStatus?: boolean
    orderId?: boolean
    createdAt?: boolean
    deal?: boolean | CommunityDealDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dealParticipant"]>

  export type DealParticipantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dealId?: boolean
    farmerId?: boolean
    quantity?: boolean
    paymentStatus?: boolean
    orderId?: boolean
    createdAt?: boolean
    deal?: boolean | CommunityDealDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dealParticipant"]>

  export type DealParticipantSelectScalar = {
    id?: boolean
    dealId?: boolean
    farmerId?: boolean
    quantity?: boolean
    paymentStatus?: boolean
    orderId?: boolean
    createdAt?: boolean
  }

  export type DealParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dealId" | "farmerId" | "quantity" | "paymentStatus" | "orderId" | "createdAt", ExtArgs["result"]["dealParticipant"]>
  export type DealParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deal?: boolean | CommunityDealDefaultArgs<ExtArgs>
  }
  export type DealParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deal?: boolean | CommunityDealDefaultArgs<ExtArgs>
  }
  export type DealParticipantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deal?: boolean | CommunityDealDefaultArgs<ExtArgs>
  }

  export type $DealParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DealParticipant"
    objects: {
      deal: Prisma.$CommunityDealPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dealId: string
      farmerId: string
      quantity: number
      paymentStatus: $Enums.PaymentStatus
      orderId: string | null
      createdAt: Date
    }, ExtArgs["result"]["dealParticipant"]>
    composites: {}
  }

  type DealParticipantGetPayload<S extends boolean | null | undefined | DealParticipantDefaultArgs> = $Result.GetResult<Prisma.$DealParticipantPayload, S>

  type DealParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DealParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DealParticipantCountAggregateInputType | true
    }

  export interface DealParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DealParticipant'], meta: { name: 'DealParticipant' } }
    /**
     * Find zero or one DealParticipant that matches the filter.
     * @param {DealParticipantFindUniqueArgs} args - Arguments to find a DealParticipant
     * @example
     * // Get one DealParticipant
     * const dealParticipant = await prisma.dealParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DealParticipantFindUniqueArgs>(args: SelectSubset<T, DealParticipantFindUniqueArgs<ExtArgs>>): Prisma__DealParticipantClient<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DealParticipant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DealParticipantFindUniqueOrThrowArgs} args - Arguments to find a DealParticipant
     * @example
     * // Get one DealParticipant
     * const dealParticipant = await prisma.dealParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DealParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, DealParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DealParticipantClient<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DealParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealParticipantFindFirstArgs} args - Arguments to find a DealParticipant
     * @example
     * // Get one DealParticipant
     * const dealParticipant = await prisma.dealParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DealParticipantFindFirstArgs>(args?: SelectSubset<T, DealParticipantFindFirstArgs<ExtArgs>>): Prisma__DealParticipantClient<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DealParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealParticipantFindFirstOrThrowArgs} args - Arguments to find a DealParticipant
     * @example
     * // Get one DealParticipant
     * const dealParticipant = await prisma.dealParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DealParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, DealParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__DealParticipantClient<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DealParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DealParticipants
     * const dealParticipants = await prisma.dealParticipant.findMany()
     * 
     * // Get first 10 DealParticipants
     * const dealParticipants = await prisma.dealParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dealParticipantWithIdOnly = await prisma.dealParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DealParticipantFindManyArgs>(args?: SelectSubset<T, DealParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DealParticipant.
     * @param {DealParticipantCreateArgs} args - Arguments to create a DealParticipant.
     * @example
     * // Create one DealParticipant
     * const DealParticipant = await prisma.dealParticipant.create({
     *   data: {
     *     // ... data to create a DealParticipant
     *   }
     * })
     * 
     */
    create<T extends DealParticipantCreateArgs>(args: SelectSubset<T, DealParticipantCreateArgs<ExtArgs>>): Prisma__DealParticipantClient<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DealParticipants.
     * @param {DealParticipantCreateManyArgs} args - Arguments to create many DealParticipants.
     * @example
     * // Create many DealParticipants
     * const dealParticipant = await prisma.dealParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DealParticipantCreateManyArgs>(args?: SelectSubset<T, DealParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DealParticipants and returns the data saved in the database.
     * @param {DealParticipantCreateManyAndReturnArgs} args - Arguments to create many DealParticipants.
     * @example
     * // Create many DealParticipants
     * const dealParticipant = await prisma.dealParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DealParticipants and only return the `id`
     * const dealParticipantWithIdOnly = await prisma.dealParticipant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DealParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, DealParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DealParticipant.
     * @param {DealParticipantDeleteArgs} args - Arguments to delete one DealParticipant.
     * @example
     * // Delete one DealParticipant
     * const DealParticipant = await prisma.dealParticipant.delete({
     *   where: {
     *     // ... filter to delete one DealParticipant
     *   }
     * })
     * 
     */
    delete<T extends DealParticipantDeleteArgs>(args: SelectSubset<T, DealParticipantDeleteArgs<ExtArgs>>): Prisma__DealParticipantClient<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DealParticipant.
     * @param {DealParticipantUpdateArgs} args - Arguments to update one DealParticipant.
     * @example
     * // Update one DealParticipant
     * const dealParticipant = await prisma.dealParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DealParticipantUpdateArgs>(args: SelectSubset<T, DealParticipantUpdateArgs<ExtArgs>>): Prisma__DealParticipantClient<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DealParticipants.
     * @param {DealParticipantDeleteManyArgs} args - Arguments to filter DealParticipants to delete.
     * @example
     * // Delete a few DealParticipants
     * const { count } = await prisma.dealParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DealParticipantDeleteManyArgs>(args?: SelectSubset<T, DealParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DealParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DealParticipants
     * const dealParticipant = await prisma.dealParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DealParticipantUpdateManyArgs>(args: SelectSubset<T, DealParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DealParticipants and returns the data updated in the database.
     * @param {DealParticipantUpdateManyAndReturnArgs} args - Arguments to update many DealParticipants.
     * @example
     * // Update many DealParticipants
     * const dealParticipant = await prisma.dealParticipant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DealParticipants and only return the `id`
     * const dealParticipantWithIdOnly = await prisma.dealParticipant.updateManyAndReturn({
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
    updateManyAndReturn<T extends DealParticipantUpdateManyAndReturnArgs>(args: SelectSubset<T, DealParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DealParticipant.
     * @param {DealParticipantUpsertArgs} args - Arguments to update or create a DealParticipant.
     * @example
     * // Update or create a DealParticipant
     * const dealParticipant = await prisma.dealParticipant.upsert({
     *   create: {
     *     // ... data to create a DealParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DealParticipant we want to update
     *   }
     * })
     */
    upsert<T extends DealParticipantUpsertArgs>(args: SelectSubset<T, DealParticipantUpsertArgs<ExtArgs>>): Prisma__DealParticipantClient<$Result.GetResult<Prisma.$DealParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DealParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealParticipantCountArgs} args - Arguments to filter DealParticipants to count.
     * @example
     * // Count the number of DealParticipants
     * const count = await prisma.dealParticipant.count({
     *   where: {
     *     // ... the filter for the DealParticipants we want to count
     *   }
     * })
    **/
    count<T extends DealParticipantCountArgs>(
      args?: Subset<T, DealParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DealParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DealParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DealParticipantAggregateArgs>(args: Subset<T, DealParticipantAggregateArgs>): Prisma.PrismaPromise<GetDealParticipantAggregateType<T>>

    /**
     * Group by DealParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealParticipantGroupByArgs} args - Group by arguments.
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
      T extends DealParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DealParticipantGroupByArgs['orderBy'] }
        : { orderBy?: DealParticipantGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DealParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDealParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DealParticipant model
   */
  readonly fields: DealParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DealParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DealParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deal<T extends CommunityDealDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommunityDealDefaultArgs<ExtArgs>>): Prisma__CommunityDealClient<$Result.GetResult<Prisma.$CommunityDealPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the DealParticipant model
   */
  interface DealParticipantFieldRefs {
    readonly id: FieldRef<"DealParticipant", 'String'>
    readonly dealId: FieldRef<"DealParticipant", 'String'>
    readonly farmerId: FieldRef<"DealParticipant", 'String'>
    readonly quantity: FieldRef<"DealParticipant", 'Int'>
    readonly paymentStatus: FieldRef<"DealParticipant", 'PaymentStatus'>
    readonly orderId: FieldRef<"DealParticipant", 'String'>
    readonly createdAt: FieldRef<"DealParticipant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DealParticipant findUnique
   */
  export type DealParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantInclude<ExtArgs> | null
    /**
     * Filter, which DealParticipant to fetch.
     */
    where: DealParticipantWhereUniqueInput
  }

  /**
   * DealParticipant findUniqueOrThrow
   */
  export type DealParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantInclude<ExtArgs> | null
    /**
     * Filter, which DealParticipant to fetch.
     */
    where: DealParticipantWhereUniqueInput
  }

  /**
   * DealParticipant findFirst
   */
  export type DealParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantInclude<ExtArgs> | null
    /**
     * Filter, which DealParticipant to fetch.
     */
    where?: DealParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DealParticipants to fetch.
     */
    orderBy?: DealParticipantOrderByWithRelationInput | DealParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DealParticipants.
     */
    cursor?: DealParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DealParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DealParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DealParticipants.
     */
    distinct?: DealParticipantScalarFieldEnum | DealParticipantScalarFieldEnum[]
  }

  /**
   * DealParticipant findFirstOrThrow
   */
  export type DealParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantInclude<ExtArgs> | null
    /**
     * Filter, which DealParticipant to fetch.
     */
    where?: DealParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DealParticipants to fetch.
     */
    orderBy?: DealParticipantOrderByWithRelationInput | DealParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DealParticipants.
     */
    cursor?: DealParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DealParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DealParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DealParticipants.
     */
    distinct?: DealParticipantScalarFieldEnum | DealParticipantScalarFieldEnum[]
  }

  /**
   * DealParticipant findMany
   */
  export type DealParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantInclude<ExtArgs> | null
    /**
     * Filter, which DealParticipants to fetch.
     */
    where?: DealParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DealParticipants to fetch.
     */
    orderBy?: DealParticipantOrderByWithRelationInput | DealParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DealParticipants.
     */
    cursor?: DealParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DealParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DealParticipants.
     */
    skip?: number
    distinct?: DealParticipantScalarFieldEnum | DealParticipantScalarFieldEnum[]
  }

  /**
   * DealParticipant create
   */
  export type DealParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a DealParticipant.
     */
    data: XOR<DealParticipantCreateInput, DealParticipantUncheckedCreateInput>
  }

  /**
   * DealParticipant createMany
   */
  export type DealParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DealParticipants.
     */
    data: DealParticipantCreateManyInput | DealParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DealParticipant createManyAndReturn
   */
  export type DealParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * The data used to create many DealParticipants.
     */
    data: DealParticipantCreateManyInput | DealParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DealParticipant update
   */
  export type DealParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a DealParticipant.
     */
    data: XOR<DealParticipantUpdateInput, DealParticipantUncheckedUpdateInput>
    /**
     * Choose, which DealParticipant to update.
     */
    where: DealParticipantWhereUniqueInput
  }

  /**
   * DealParticipant updateMany
   */
  export type DealParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DealParticipants.
     */
    data: XOR<DealParticipantUpdateManyMutationInput, DealParticipantUncheckedUpdateManyInput>
    /**
     * Filter which DealParticipants to update
     */
    where?: DealParticipantWhereInput
    /**
     * Limit how many DealParticipants to update.
     */
    limit?: number
  }

  /**
   * DealParticipant updateManyAndReturn
   */
  export type DealParticipantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * The data used to update DealParticipants.
     */
    data: XOR<DealParticipantUpdateManyMutationInput, DealParticipantUncheckedUpdateManyInput>
    /**
     * Filter which DealParticipants to update
     */
    where?: DealParticipantWhereInput
    /**
     * Limit how many DealParticipants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DealParticipant upsert
   */
  export type DealParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the DealParticipant to update in case it exists.
     */
    where: DealParticipantWhereUniqueInput
    /**
     * In case the DealParticipant found by the `where` argument doesn't exist, create a new DealParticipant with this data.
     */
    create: XOR<DealParticipantCreateInput, DealParticipantUncheckedCreateInput>
    /**
     * In case the DealParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DealParticipantUpdateInput, DealParticipantUncheckedUpdateInput>
  }

  /**
   * DealParticipant delete
   */
  export type DealParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantInclude<ExtArgs> | null
    /**
     * Filter which DealParticipant to delete.
     */
    where: DealParticipantWhereUniqueInput
  }

  /**
   * DealParticipant deleteMany
   */
  export type DealParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DealParticipants to delete
     */
    where?: DealParticipantWhereInput
    /**
     * Limit how many DealParticipants to delete.
     */
    limit?: number
  }

  /**
   * DealParticipant without action
   */
  export type DealParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealParticipant
     */
    select?: DealParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DealParticipant
     */
    omit?: DealParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DealParticipantInclude<ExtArgs> | null
  }


  /**
   * Model WishlistItem
   */

  export type AggregateWishlistItem = {
    _count: WishlistItemCountAggregateOutputType | null
    _min: WishlistItemMinAggregateOutputType | null
    _max: WishlistItemMaxAggregateOutputType | null
  }

  export type WishlistItemMinAggregateOutputType = {
    id: string | null
    farmerId: string | null
    productId: string | null
    supplierId: string | null
    addedAt: Date | null
  }

  export type WishlistItemMaxAggregateOutputType = {
    id: string | null
    farmerId: string | null
    productId: string | null
    supplierId: string | null
    addedAt: Date | null
  }

  export type WishlistItemCountAggregateOutputType = {
    id: number
    farmerId: number
    productId: number
    supplierId: number
    snapshot: number
    addedAt: number
    _all: number
  }


  export type WishlistItemMinAggregateInputType = {
    id?: true
    farmerId?: true
    productId?: true
    supplierId?: true
    addedAt?: true
  }

  export type WishlistItemMaxAggregateInputType = {
    id?: true
    farmerId?: true
    productId?: true
    supplierId?: true
    addedAt?: true
  }

  export type WishlistItemCountAggregateInputType = {
    id?: true
    farmerId?: true
    productId?: true
    supplierId?: true
    snapshot?: true
    addedAt?: true
    _all?: true
  }

  export type WishlistItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WishlistItem to aggregate.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WishlistItems
    **/
    _count?: true | WishlistItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WishlistItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WishlistItemMaxAggregateInputType
  }

  export type GetWishlistItemAggregateType<T extends WishlistItemAggregateArgs> = {
        [P in keyof T & keyof AggregateWishlistItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWishlistItem[P]>
      : GetScalarType<T[P], AggregateWishlistItem[P]>
  }




  export type WishlistItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WishlistItemWhereInput
    orderBy?: WishlistItemOrderByWithAggregationInput | WishlistItemOrderByWithAggregationInput[]
    by: WishlistItemScalarFieldEnum[] | WishlistItemScalarFieldEnum
    having?: WishlistItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WishlistItemCountAggregateInputType | true
    _min?: WishlistItemMinAggregateInputType
    _max?: WishlistItemMaxAggregateInputType
  }

  export type WishlistItemGroupByOutputType = {
    id: string
    farmerId: string
    productId: string
    supplierId: string
    snapshot: JsonValue
    addedAt: Date
    _count: WishlistItemCountAggregateOutputType | null
    _min: WishlistItemMinAggregateOutputType | null
    _max: WishlistItemMaxAggregateOutputType | null
  }

  type GetWishlistItemGroupByPayload<T extends WishlistItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WishlistItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WishlistItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WishlistItemGroupByOutputType[P]>
            : GetScalarType<T[P], WishlistItemGroupByOutputType[P]>
        }
      >
    >


  export type WishlistItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    farmerId?: boolean
    productId?: boolean
    supplierId?: boolean
    snapshot?: boolean
    addedAt?: boolean
  }, ExtArgs["result"]["wishlistItem"]>

  export type WishlistItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    farmerId?: boolean
    productId?: boolean
    supplierId?: boolean
    snapshot?: boolean
    addedAt?: boolean
  }, ExtArgs["result"]["wishlistItem"]>

  export type WishlistItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    farmerId?: boolean
    productId?: boolean
    supplierId?: boolean
    snapshot?: boolean
    addedAt?: boolean
  }, ExtArgs["result"]["wishlistItem"]>

  export type WishlistItemSelectScalar = {
    id?: boolean
    farmerId?: boolean
    productId?: boolean
    supplierId?: boolean
    snapshot?: boolean
    addedAt?: boolean
  }

  export type WishlistItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "farmerId" | "productId" | "supplierId" | "snapshot" | "addedAt", ExtArgs["result"]["wishlistItem"]>

  export type $WishlistItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WishlistItem"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      farmerId: string
      productId: string
      supplierId: string
      snapshot: Prisma.JsonValue
      addedAt: Date
    }, ExtArgs["result"]["wishlistItem"]>
    composites: {}
  }

  type WishlistItemGetPayload<S extends boolean | null | undefined | WishlistItemDefaultArgs> = $Result.GetResult<Prisma.$WishlistItemPayload, S>

  type WishlistItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WishlistItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WishlistItemCountAggregateInputType | true
    }

  export interface WishlistItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WishlistItem'], meta: { name: 'WishlistItem' } }
    /**
     * Find zero or one WishlistItem that matches the filter.
     * @param {WishlistItemFindUniqueArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WishlistItemFindUniqueArgs>(args: SelectSubset<T, WishlistItemFindUniqueArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WishlistItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WishlistItemFindUniqueOrThrowArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WishlistItemFindUniqueOrThrowArgs>(args: SelectSubset<T, WishlistItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WishlistItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindFirstArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WishlistItemFindFirstArgs>(args?: SelectSubset<T, WishlistItemFindFirstArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WishlistItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindFirstOrThrowArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WishlistItemFindFirstOrThrowArgs>(args?: SelectSubset<T, WishlistItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WishlistItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WishlistItems
     * const wishlistItems = await prisma.wishlistItem.findMany()
     * 
     * // Get first 10 WishlistItems
     * const wishlistItems = await prisma.wishlistItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const wishlistItemWithIdOnly = await prisma.wishlistItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WishlistItemFindManyArgs>(args?: SelectSubset<T, WishlistItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WishlistItem.
     * @param {WishlistItemCreateArgs} args - Arguments to create a WishlistItem.
     * @example
     * // Create one WishlistItem
     * const WishlistItem = await prisma.wishlistItem.create({
     *   data: {
     *     // ... data to create a WishlistItem
     *   }
     * })
     * 
     */
    create<T extends WishlistItemCreateArgs>(args: SelectSubset<T, WishlistItemCreateArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WishlistItems.
     * @param {WishlistItemCreateManyArgs} args - Arguments to create many WishlistItems.
     * @example
     * // Create many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WishlistItemCreateManyArgs>(args?: SelectSubset<T, WishlistItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WishlistItems and returns the data saved in the database.
     * @param {WishlistItemCreateManyAndReturnArgs} args - Arguments to create many WishlistItems.
     * @example
     * // Create many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WishlistItems and only return the `id`
     * const wishlistItemWithIdOnly = await prisma.wishlistItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WishlistItemCreateManyAndReturnArgs>(args?: SelectSubset<T, WishlistItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WishlistItem.
     * @param {WishlistItemDeleteArgs} args - Arguments to delete one WishlistItem.
     * @example
     * // Delete one WishlistItem
     * const WishlistItem = await prisma.wishlistItem.delete({
     *   where: {
     *     // ... filter to delete one WishlistItem
     *   }
     * })
     * 
     */
    delete<T extends WishlistItemDeleteArgs>(args: SelectSubset<T, WishlistItemDeleteArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WishlistItem.
     * @param {WishlistItemUpdateArgs} args - Arguments to update one WishlistItem.
     * @example
     * // Update one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WishlistItemUpdateArgs>(args: SelectSubset<T, WishlistItemUpdateArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WishlistItems.
     * @param {WishlistItemDeleteManyArgs} args - Arguments to filter WishlistItems to delete.
     * @example
     * // Delete a few WishlistItems
     * const { count } = await prisma.wishlistItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WishlistItemDeleteManyArgs>(args?: SelectSubset<T, WishlistItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WishlistItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WishlistItemUpdateManyArgs>(args: SelectSubset<T, WishlistItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WishlistItems and returns the data updated in the database.
     * @param {WishlistItemUpdateManyAndReturnArgs} args - Arguments to update many WishlistItems.
     * @example
     * // Update many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WishlistItems and only return the `id`
     * const wishlistItemWithIdOnly = await prisma.wishlistItem.updateManyAndReturn({
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
    updateManyAndReturn<T extends WishlistItemUpdateManyAndReturnArgs>(args: SelectSubset<T, WishlistItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WishlistItem.
     * @param {WishlistItemUpsertArgs} args - Arguments to update or create a WishlistItem.
     * @example
     * // Update or create a WishlistItem
     * const wishlistItem = await prisma.wishlistItem.upsert({
     *   create: {
     *     // ... data to create a WishlistItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WishlistItem we want to update
     *   }
     * })
     */
    upsert<T extends WishlistItemUpsertArgs>(args: SelectSubset<T, WishlistItemUpsertArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WishlistItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemCountArgs} args - Arguments to filter WishlistItems to count.
     * @example
     * // Count the number of WishlistItems
     * const count = await prisma.wishlistItem.count({
     *   where: {
     *     // ... the filter for the WishlistItems we want to count
     *   }
     * })
    **/
    count<T extends WishlistItemCountArgs>(
      args?: Subset<T, WishlistItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WishlistItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WishlistItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WishlistItemAggregateArgs>(args: Subset<T, WishlistItemAggregateArgs>): Prisma.PrismaPromise<GetWishlistItemAggregateType<T>>

    /**
     * Group by WishlistItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemGroupByArgs} args - Group by arguments.
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
      T extends WishlistItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WishlistItemGroupByArgs['orderBy'] }
        : { orderBy?: WishlistItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WishlistItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWishlistItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WishlistItem model
   */
  readonly fields: WishlistItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WishlistItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WishlistItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the WishlistItem model
   */
  interface WishlistItemFieldRefs {
    readonly id: FieldRef<"WishlistItem", 'String'>
    readonly farmerId: FieldRef<"WishlistItem", 'String'>
    readonly productId: FieldRef<"WishlistItem", 'String'>
    readonly supplierId: FieldRef<"WishlistItem", 'String'>
    readonly snapshot: FieldRef<"WishlistItem", 'Json'>
    readonly addedAt: FieldRef<"WishlistItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WishlistItem findUnique
   */
  export type WishlistItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem findUniqueOrThrow
   */
  export type WishlistItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem findFirst
   */
  export type WishlistItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WishlistItems.
     */
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[]
  }

  /**
   * WishlistItem findFirstOrThrow
   */
  export type WishlistItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WishlistItems.
     */
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[]
  }

  /**
   * WishlistItem findMany
   */
  export type WishlistItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Filter, which WishlistItems to fetch.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[]
  }

  /**
   * WishlistItem create
   */
  export type WishlistItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * The data needed to create a WishlistItem.
     */
    data: XOR<WishlistItemCreateInput, WishlistItemUncheckedCreateInput>
  }

  /**
   * WishlistItem createMany
   */
  export type WishlistItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WishlistItems.
     */
    data: WishlistItemCreateManyInput | WishlistItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WishlistItem createManyAndReturn
   */
  export type WishlistItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * The data used to create many WishlistItems.
     */
    data: WishlistItemCreateManyInput | WishlistItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WishlistItem update
   */
  export type WishlistItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * The data needed to update a WishlistItem.
     */
    data: XOR<WishlistItemUpdateInput, WishlistItemUncheckedUpdateInput>
    /**
     * Choose, which WishlistItem to update.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem updateMany
   */
  export type WishlistItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WishlistItems.
     */
    data: XOR<WishlistItemUpdateManyMutationInput, WishlistItemUncheckedUpdateManyInput>
    /**
     * Filter which WishlistItems to update
     */
    where?: WishlistItemWhereInput
    /**
     * Limit how many WishlistItems to update.
     */
    limit?: number
  }

  /**
   * WishlistItem updateManyAndReturn
   */
  export type WishlistItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * The data used to update WishlistItems.
     */
    data: XOR<WishlistItemUpdateManyMutationInput, WishlistItemUncheckedUpdateManyInput>
    /**
     * Filter which WishlistItems to update
     */
    where?: WishlistItemWhereInput
    /**
     * Limit how many WishlistItems to update.
     */
    limit?: number
  }

  /**
   * WishlistItem upsert
   */
  export type WishlistItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * The filter to search for the WishlistItem to update in case it exists.
     */
    where: WishlistItemWhereUniqueInput
    /**
     * In case the WishlistItem found by the `where` argument doesn't exist, create a new WishlistItem with this data.
     */
    create: XOR<WishlistItemCreateInput, WishlistItemUncheckedCreateInput>
    /**
     * In case the WishlistItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WishlistItemUpdateInput, WishlistItemUncheckedUpdateInput>
  }

  /**
   * WishlistItem delete
   */
  export type WishlistItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Filter which WishlistItem to delete.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem deleteMany
   */
  export type WishlistItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WishlistItems to delete
     */
    where?: WishlistItemWhereInput
    /**
     * Limit how many WishlistItems to delete.
     */
    limit?: number
  }

  /**
   * WishlistItem without action
   */
  export type WishlistItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
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


  export const OrderScalarFieldEnum: {
    id: 'id',
    orderNumber: 'orderNumber',
    farmerId: 'farmerId',
    supplierId: 'supplierId',
    items: 'items',
    subtotalPaise: 'subtotalPaise',
    taxPaise: 'taxPaise',
    shippingPaise: 'shippingPaise',
    totalPaise: 'totalPaise',
    paymentMethod: 'paymentMethod',
    paymentStatus: 'paymentStatus',
    razorpayOrderId: 'razorpayOrderId',
    razorpayPaymentId: 'razorpayPaymentId',
    razorpaySignature: 'razorpaySignature',
    paidAt: 'paidAt',
    orderStatus: 'orderStatus',
    shippingAddress: 'shippingAddress',
    trackingNumber: 'trackingNumber',
    carrier: 'carrier',
    estimatedDelivery: 'estimatedDelivery',
    actualDelivery: 'actualDelivery',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const CartItemScalarFieldEnum: {
    id: 'id',
    farmerId: 'farmerId',
    productId: 'productId',
    supplierId: 'supplierId',
    quantity: 'quantity',
    snapshot: 'snapshot',
    addedAt: 'addedAt',
    updatedAt: 'updatedAt'
  };

  export type CartItemScalarFieldEnum = (typeof CartItemScalarFieldEnum)[keyof typeof CartItemScalarFieldEnum]


  export const ReviewScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    supplierId: 'supplierId',
    farmerId: 'farmerId',
    orderId: 'orderId',
    rating: 'rating',
    title: 'title',
    body: 'body',
    isVerified: 'isVerified',
    isFlagged: 'isFlagged',
    flagReason: 'flagReason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum]


  export const InquiryScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    farmerId: 'farmerId',
    supplierId: 'supplierId',
    subject: 'subject',
    body: 'body',
    status: 'status',
    lastMessageAt: 'lastMessageAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InquiryScalarFieldEnum = (typeof InquiryScalarFieldEnum)[keyof typeof InquiryScalarFieldEnum]


  export const InquiryReplyScalarFieldEnum: {
    id: 'id',
    inquiryId: 'inquiryId',
    senderId: 'senderId',
    senderRole: 'senderRole',
    message: 'message',
    createdAt: 'createdAt'
  };

  export type InquiryReplyScalarFieldEnum = (typeof InquiryReplyScalarFieldEnum)[keyof typeof InquiryReplyScalarFieldEnum]


  export const CommunityDealScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    supplierId: 'supplierId',
    title: 'title',
    description: 'description',
    targetQuantity: 'targetQuantity',
    currentQuantity: 'currentQuantity',
    originalPricePaise: 'originalPricePaise',
    dealPricePaise: 'dealPricePaise',
    endsAt: 'endsAt',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CommunityDealScalarFieldEnum = (typeof CommunityDealScalarFieldEnum)[keyof typeof CommunityDealScalarFieldEnum]


  export const DealParticipantScalarFieldEnum: {
    id: 'id',
    dealId: 'dealId',
    farmerId: 'farmerId',
    quantity: 'quantity',
    paymentStatus: 'paymentStatus',
    orderId: 'orderId',
    createdAt: 'createdAt'
  };

  export type DealParticipantScalarFieldEnum = (typeof DealParticipantScalarFieldEnum)[keyof typeof DealParticipantScalarFieldEnum]


  export const WishlistItemScalarFieldEnum: {
    id: 'id',
    farmerId: 'farmerId',
    productId: 'productId',
    supplierId: 'supplierId',
    snapshot: 'snapshot',
    addedAt: 'addedAt'
  };

  export type WishlistItemScalarFieldEnum = (typeof WishlistItemScalarFieldEnum)[keyof typeof WishlistItemScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>
    


  /**
   * Reference to a field of type 'PaymentMethod[]'
   */
  export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'OrderStatus'
   */
  export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus'>
    


  /**
   * Reference to a field of type 'OrderStatus[]'
   */
  export type ListEnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'InquiryStatus'
   */
  export type EnumInquiryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InquiryStatus'>
    


  /**
   * Reference to a field of type 'InquiryStatus[]'
   */
  export type ListEnumInquiryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InquiryStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    orderNumber?: StringFilter<"Order"> | string
    farmerId?: StringFilter<"Order"> | string
    supplierId?: StringFilter<"Order"> | string
    items?: JsonFilter<"Order">
    subtotalPaise?: IntFilter<"Order"> | number
    taxPaise?: IntFilter<"Order"> | number
    shippingPaise?: IntFilter<"Order"> | number
    totalPaise?: IntFilter<"Order"> | number
    paymentMethod?: EnumPaymentMethodFilter<"Order"> | $Enums.PaymentMethod
    paymentStatus?: EnumPaymentStatusFilter<"Order"> | $Enums.PaymentStatus
    razorpayOrderId?: StringNullableFilter<"Order"> | string | null
    razorpayPaymentId?: StringNullableFilter<"Order"> | string | null
    razorpaySignature?: StringNullableFilter<"Order"> | string | null
    paidAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    orderStatus?: EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus
    shippingAddress?: JsonFilter<"Order">
    trackingNumber?: StringNullableFilter<"Order"> | string | null
    carrier?: StringNullableFilter<"Order"> | string | null
    estimatedDelivery?: DateTimeNullableFilter<"Order"> | Date | string | null
    actualDelivery?: DateTimeNullableFilter<"Order"> | Date | string | null
    notes?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    farmerId?: SortOrder
    supplierId?: SortOrder
    items?: SortOrder
    subtotalPaise?: SortOrder
    taxPaise?: SortOrder
    shippingPaise?: SortOrder
    totalPaise?: SortOrder
    paymentMethod?: SortOrder
    paymentStatus?: SortOrder
    razorpayOrderId?: SortOrderInput | SortOrder
    razorpayPaymentId?: SortOrderInput | SortOrder
    razorpaySignature?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    orderStatus?: SortOrder
    shippingAddress?: SortOrder
    trackingNumber?: SortOrderInput | SortOrder
    carrier?: SortOrderInput | SortOrder
    estimatedDelivery?: SortOrderInput | SortOrder
    actualDelivery?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderNumber?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    farmerId?: StringFilter<"Order"> | string
    supplierId?: StringFilter<"Order"> | string
    items?: JsonFilter<"Order">
    subtotalPaise?: IntFilter<"Order"> | number
    taxPaise?: IntFilter<"Order"> | number
    shippingPaise?: IntFilter<"Order"> | number
    totalPaise?: IntFilter<"Order"> | number
    paymentMethod?: EnumPaymentMethodFilter<"Order"> | $Enums.PaymentMethod
    paymentStatus?: EnumPaymentStatusFilter<"Order"> | $Enums.PaymentStatus
    razorpayOrderId?: StringNullableFilter<"Order"> | string | null
    razorpayPaymentId?: StringNullableFilter<"Order"> | string | null
    razorpaySignature?: StringNullableFilter<"Order"> | string | null
    paidAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    orderStatus?: EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus
    shippingAddress?: JsonFilter<"Order">
    trackingNumber?: StringNullableFilter<"Order"> | string | null
    carrier?: StringNullableFilter<"Order"> | string | null
    estimatedDelivery?: DateTimeNullableFilter<"Order"> | Date | string | null
    actualDelivery?: DateTimeNullableFilter<"Order"> | Date | string | null
    notes?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
  }, "id" | "orderNumber">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    farmerId?: SortOrder
    supplierId?: SortOrder
    items?: SortOrder
    subtotalPaise?: SortOrder
    taxPaise?: SortOrder
    shippingPaise?: SortOrder
    totalPaise?: SortOrder
    paymentMethod?: SortOrder
    paymentStatus?: SortOrder
    razorpayOrderId?: SortOrderInput | SortOrder
    razorpayPaymentId?: SortOrderInput | SortOrder
    razorpaySignature?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    orderStatus?: SortOrder
    shippingAddress?: SortOrder
    trackingNumber?: SortOrderInput | SortOrder
    carrier?: SortOrderInput | SortOrder
    estimatedDelivery?: SortOrderInput | SortOrder
    actualDelivery?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrderCountOrderByAggregateInput
    _avg?: OrderAvgOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
    _sum?: OrderSumOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    orderNumber?: StringWithAggregatesFilter<"Order"> | string
    farmerId?: StringWithAggregatesFilter<"Order"> | string
    supplierId?: StringWithAggregatesFilter<"Order"> | string
    items?: JsonWithAggregatesFilter<"Order">
    subtotalPaise?: IntWithAggregatesFilter<"Order"> | number
    taxPaise?: IntWithAggregatesFilter<"Order"> | number
    shippingPaise?: IntWithAggregatesFilter<"Order"> | number
    totalPaise?: IntWithAggregatesFilter<"Order"> | number
    paymentMethod?: EnumPaymentMethodWithAggregatesFilter<"Order"> | $Enums.PaymentMethod
    paymentStatus?: EnumPaymentStatusWithAggregatesFilter<"Order"> | $Enums.PaymentStatus
    razorpayOrderId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    razorpayPaymentId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    razorpaySignature?: StringNullableWithAggregatesFilter<"Order"> | string | null
    paidAt?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    orderStatus?: EnumOrderStatusWithAggregatesFilter<"Order"> | $Enums.OrderStatus
    shippingAddress?: JsonWithAggregatesFilter<"Order">
    trackingNumber?: StringNullableWithAggregatesFilter<"Order"> | string | null
    carrier?: StringNullableWithAggregatesFilter<"Order"> | string | null
    estimatedDelivery?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    actualDelivery?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    notes?: StringNullableWithAggregatesFilter<"Order"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
  }

  export type CartItemWhereInput = {
    AND?: CartItemWhereInput | CartItemWhereInput[]
    OR?: CartItemWhereInput[]
    NOT?: CartItemWhereInput | CartItemWhereInput[]
    id?: StringFilter<"CartItem"> | string
    farmerId?: StringFilter<"CartItem"> | string
    productId?: StringFilter<"CartItem"> | string
    supplierId?: StringFilter<"CartItem"> | string
    quantity?: IntFilter<"CartItem"> | number
    snapshot?: JsonFilter<"CartItem">
    addedAt?: DateTimeFilter<"CartItem"> | Date | string
    updatedAt?: DateTimeFilter<"CartItem"> | Date | string
  }

  export type CartItemOrderByWithRelationInput = {
    id?: SortOrder
    farmerId?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    quantity?: SortOrder
    snapshot?: SortOrder
    addedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    farmerId_productId?: CartItemFarmerIdProductIdCompoundUniqueInput
    AND?: CartItemWhereInput | CartItemWhereInput[]
    OR?: CartItemWhereInput[]
    NOT?: CartItemWhereInput | CartItemWhereInput[]
    farmerId?: StringFilter<"CartItem"> | string
    productId?: StringFilter<"CartItem"> | string
    supplierId?: StringFilter<"CartItem"> | string
    quantity?: IntFilter<"CartItem"> | number
    snapshot?: JsonFilter<"CartItem">
    addedAt?: DateTimeFilter<"CartItem"> | Date | string
    updatedAt?: DateTimeFilter<"CartItem"> | Date | string
  }, "id" | "farmerId_productId">

  export type CartItemOrderByWithAggregationInput = {
    id?: SortOrder
    farmerId?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    quantity?: SortOrder
    snapshot?: SortOrder
    addedAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CartItemCountOrderByAggregateInput
    _avg?: CartItemAvgOrderByAggregateInput
    _max?: CartItemMaxOrderByAggregateInput
    _min?: CartItemMinOrderByAggregateInput
    _sum?: CartItemSumOrderByAggregateInput
  }

  export type CartItemScalarWhereWithAggregatesInput = {
    AND?: CartItemScalarWhereWithAggregatesInput | CartItemScalarWhereWithAggregatesInput[]
    OR?: CartItemScalarWhereWithAggregatesInput[]
    NOT?: CartItemScalarWhereWithAggregatesInput | CartItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CartItem"> | string
    farmerId?: StringWithAggregatesFilter<"CartItem"> | string
    productId?: StringWithAggregatesFilter<"CartItem"> | string
    supplierId?: StringWithAggregatesFilter<"CartItem"> | string
    quantity?: IntWithAggregatesFilter<"CartItem"> | number
    snapshot?: JsonWithAggregatesFilter<"CartItem">
    addedAt?: DateTimeWithAggregatesFilter<"CartItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CartItem"> | Date | string
  }

  export type ReviewWhereInput = {
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    id?: StringFilter<"Review"> | string
    productId?: StringFilter<"Review"> | string
    supplierId?: StringFilter<"Review"> | string
    farmerId?: StringFilter<"Review"> | string
    orderId?: StringNullableFilter<"Review"> | string | null
    rating?: IntFilter<"Review"> | number
    title?: StringFilter<"Review"> | string
    body?: StringFilter<"Review"> | string
    isVerified?: BoolFilter<"Review"> | boolean
    isFlagged?: BoolFilter<"Review"> | boolean
    flagReason?: StringNullableFilter<"Review"> | string | null
    createdAt?: DateTimeFilter<"Review"> | Date | string
    updatedAt?: DateTimeFilter<"Review"> | Date | string
  }

  export type ReviewOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    farmerId?: SortOrder
    orderId?: SortOrderInput | SortOrder
    rating?: SortOrder
    title?: SortOrder
    body?: SortOrder
    isVerified?: SortOrder
    isFlagged?: SortOrder
    flagReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    productId?: StringFilter<"Review"> | string
    supplierId?: StringFilter<"Review"> | string
    farmerId?: StringFilter<"Review"> | string
    orderId?: StringNullableFilter<"Review"> | string | null
    rating?: IntFilter<"Review"> | number
    title?: StringFilter<"Review"> | string
    body?: StringFilter<"Review"> | string
    isVerified?: BoolFilter<"Review"> | boolean
    isFlagged?: BoolFilter<"Review"> | boolean
    flagReason?: StringNullableFilter<"Review"> | string | null
    createdAt?: DateTimeFilter<"Review"> | Date | string
    updatedAt?: DateTimeFilter<"Review"> | Date | string
  }, "id">

  export type ReviewOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    farmerId?: SortOrder
    orderId?: SortOrderInput | SortOrder
    rating?: SortOrder
    title?: SortOrder
    body?: SortOrder
    isVerified?: SortOrder
    isFlagged?: SortOrder
    flagReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReviewCountOrderByAggregateInput
    _avg?: ReviewAvgOrderByAggregateInput
    _max?: ReviewMaxOrderByAggregateInput
    _min?: ReviewMinOrderByAggregateInput
    _sum?: ReviewSumOrderByAggregateInput
  }

  export type ReviewScalarWhereWithAggregatesInput = {
    AND?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    OR?: ReviewScalarWhereWithAggregatesInput[]
    NOT?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Review"> | string
    productId?: StringWithAggregatesFilter<"Review"> | string
    supplierId?: StringWithAggregatesFilter<"Review"> | string
    farmerId?: StringWithAggregatesFilter<"Review"> | string
    orderId?: StringNullableWithAggregatesFilter<"Review"> | string | null
    rating?: IntWithAggregatesFilter<"Review"> | number
    title?: StringWithAggregatesFilter<"Review"> | string
    body?: StringWithAggregatesFilter<"Review"> | string
    isVerified?: BoolWithAggregatesFilter<"Review"> | boolean
    isFlagged?: BoolWithAggregatesFilter<"Review"> | boolean
    flagReason?: StringNullableWithAggregatesFilter<"Review"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Review"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Review"> | Date | string
  }

  export type InquiryWhereInput = {
    AND?: InquiryWhereInput | InquiryWhereInput[]
    OR?: InquiryWhereInput[]
    NOT?: InquiryWhereInput | InquiryWhereInput[]
    id?: StringFilter<"Inquiry"> | string
    productId?: StringNullableFilter<"Inquiry"> | string | null
    farmerId?: StringFilter<"Inquiry"> | string
    supplierId?: StringFilter<"Inquiry"> | string
    subject?: StringFilter<"Inquiry"> | string
    body?: StringFilter<"Inquiry"> | string
    status?: EnumInquiryStatusFilter<"Inquiry"> | $Enums.InquiryStatus
    lastMessageAt?: DateTimeFilter<"Inquiry"> | Date | string
    createdAt?: DateTimeFilter<"Inquiry"> | Date | string
    updatedAt?: DateTimeFilter<"Inquiry"> | Date | string
    replies?: InquiryReplyListRelationFilter
  }

  export type InquiryOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrderInput | SortOrder
    farmerId?: SortOrder
    supplierId?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    status?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    replies?: InquiryReplyOrderByRelationAggregateInput
  }

  export type InquiryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InquiryWhereInput | InquiryWhereInput[]
    OR?: InquiryWhereInput[]
    NOT?: InquiryWhereInput | InquiryWhereInput[]
    productId?: StringNullableFilter<"Inquiry"> | string | null
    farmerId?: StringFilter<"Inquiry"> | string
    supplierId?: StringFilter<"Inquiry"> | string
    subject?: StringFilter<"Inquiry"> | string
    body?: StringFilter<"Inquiry"> | string
    status?: EnumInquiryStatusFilter<"Inquiry"> | $Enums.InquiryStatus
    lastMessageAt?: DateTimeFilter<"Inquiry"> | Date | string
    createdAt?: DateTimeFilter<"Inquiry"> | Date | string
    updatedAt?: DateTimeFilter<"Inquiry"> | Date | string
    replies?: InquiryReplyListRelationFilter
  }, "id">

  export type InquiryOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrderInput | SortOrder
    farmerId?: SortOrder
    supplierId?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    status?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InquiryCountOrderByAggregateInput
    _max?: InquiryMaxOrderByAggregateInput
    _min?: InquiryMinOrderByAggregateInput
  }

  export type InquiryScalarWhereWithAggregatesInput = {
    AND?: InquiryScalarWhereWithAggregatesInput | InquiryScalarWhereWithAggregatesInput[]
    OR?: InquiryScalarWhereWithAggregatesInput[]
    NOT?: InquiryScalarWhereWithAggregatesInput | InquiryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Inquiry"> | string
    productId?: StringNullableWithAggregatesFilter<"Inquiry"> | string | null
    farmerId?: StringWithAggregatesFilter<"Inquiry"> | string
    supplierId?: StringWithAggregatesFilter<"Inquiry"> | string
    subject?: StringWithAggregatesFilter<"Inquiry"> | string
    body?: StringWithAggregatesFilter<"Inquiry"> | string
    status?: EnumInquiryStatusWithAggregatesFilter<"Inquiry"> | $Enums.InquiryStatus
    lastMessageAt?: DateTimeWithAggregatesFilter<"Inquiry"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Inquiry"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Inquiry"> | Date | string
  }

  export type InquiryReplyWhereInput = {
    AND?: InquiryReplyWhereInput | InquiryReplyWhereInput[]
    OR?: InquiryReplyWhereInput[]
    NOT?: InquiryReplyWhereInput | InquiryReplyWhereInput[]
    id?: StringFilter<"InquiryReply"> | string
    inquiryId?: StringFilter<"InquiryReply"> | string
    senderId?: StringFilter<"InquiryReply"> | string
    senderRole?: StringFilter<"InquiryReply"> | string
    message?: StringFilter<"InquiryReply"> | string
    createdAt?: DateTimeFilter<"InquiryReply"> | Date | string
    inquiry?: XOR<InquiryScalarRelationFilter, InquiryWhereInput>
  }

  export type InquiryReplyOrderByWithRelationInput = {
    id?: SortOrder
    inquiryId?: SortOrder
    senderId?: SortOrder
    senderRole?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    inquiry?: InquiryOrderByWithRelationInput
  }

  export type InquiryReplyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InquiryReplyWhereInput | InquiryReplyWhereInput[]
    OR?: InquiryReplyWhereInput[]
    NOT?: InquiryReplyWhereInput | InquiryReplyWhereInput[]
    inquiryId?: StringFilter<"InquiryReply"> | string
    senderId?: StringFilter<"InquiryReply"> | string
    senderRole?: StringFilter<"InquiryReply"> | string
    message?: StringFilter<"InquiryReply"> | string
    createdAt?: DateTimeFilter<"InquiryReply"> | Date | string
    inquiry?: XOR<InquiryScalarRelationFilter, InquiryWhereInput>
  }, "id">

  export type InquiryReplyOrderByWithAggregationInput = {
    id?: SortOrder
    inquiryId?: SortOrder
    senderId?: SortOrder
    senderRole?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    _count?: InquiryReplyCountOrderByAggregateInput
    _max?: InquiryReplyMaxOrderByAggregateInput
    _min?: InquiryReplyMinOrderByAggregateInput
  }

  export type InquiryReplyScalarWhereWithAggregatesInput = {
    AND?: InquiryReplyScalarWhereWithAggregatesInput | InquiryReplyScalarWhereWithAggregatesInput[]
    OR?: InquiryReplyScalarWhereWithAggregatesInput[]
    NOT?: InquiryReplyScalarWhereWithAggregatesInput | InquiryReplyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InquiryReply"> | string
    inquiryId?: StringWithAggregatesFilter<"InquiryReply"> | string
    senderId?: StringWithAggregatesFilter<"InquiryReply"> | string
    senderRole?: StringWithAggregatesFilter<"InquiryReply"> | string
    message?: StringWithAggregatesFilter<"InquiryReply"> | string
    createdAt?: DateTimeWithAggregatesFilter<"InquiryReply"> | Date | string
  }

  export type CommunityDealWhereInput = {
    AND?: CommunityDealWhereInput | CommunityDealWhereInput[]
    OR?: CommunityDealWhereInput[]
    NOT?: CommunityDealWhereInput | CommunityDealWhereInput[]
    id?: StringFilter<"CommunityDeal"> | string
    productId?: StringFilter<"CommunityDeal"> | string
    supplierId?: StringFilter<"CommunityDeal"> | string
    title?: StringFilter<"CommunityDeal"> | string
    description?: StringFilter<"CommunityDeal"> | string
    targetQuantity?: IntFilter<"CommunityDeal"> | number
    currentQuantity?: IntFilter<"CommunityDeal"> | number
    originalPricePaise?: IntFilter<"CommunityDeal"> | number
    dealPricePaise?: IntFilter<"CommunityDeal"> | number
    endsAt?: DateTimeFilter<"CommunityDeal"> | Date | string
    isActive?: BoolFilter<"CommunityDeal"> | boolean
    createdAt?: DateTimeFilter<"CommunityDeal"> | Date | string
    updatedAt?: DateTimeFilter<"CommunityDeal"> | Date | string
    participants?: DealParticipantListRelationFilter
  }

  export type CommunityDealOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    targetQuantity?: SortOrder
    currentQuantity?: SortOrder
    originalPricePaise?: SortOrder
    dealPricePaise?: SortOrder
    endsAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    participants?: DealParticipantOrderByRelationAggregateInput
  }

  export type CommunityDealWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommunityDealWhereInput | CommunityDealWhereInput[]
    OR?: CommunityDealWhereInput[]
    NOT?: CommunityDealWhereInput | CommunityDealWhereInput[]
    productId?: StringFilter<"CommunityDeal"> | string
    supplierId?: StringFilter<"CommunityDeal"> | string
    title?: StringFilter<"CommunityDeal"> | string
    description?: StringFilter<"CommunityDeal"> | string
    targetQuantity?: IntFilter<"CommunityDeal"> | number
    currentQuantity?: IntFilter<"CommunityDeal"> | number
    originalPricePaise?: IntFilter<"CommunityDeal"> | number
    dealPricePaise?: IntFilter<"CommunityDeal"> | number
    endsAt?: DateTimeFilter<"CommunityDeal"> | Date | string
    isActive?: BoolFilter<"CommunityDeal"> | boolean
    createdAt?: DateTimeFilter<"CommunityDeal"> | Date | string
    updatedAt?: DateTimeFilter<"CommunityDeal"> | Date | string
    participants?: DealParticipantListRelationFilter
  }, "id">

  export type CommunityDealOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    targetQuantity?: SortOrder
    currentQuantity?: SortOrder
    originalPricePaise?: SortOrder
    dealPricePaise?: SortOrder
    endsAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CommunityDealCountOrderByAggregateInput
    _avg?: CommunityDealAvgOrderByAggregateInput
    _max?: CommunityDealMaxOrderByAggregateInput
    _min?: CommunityDealMinOrderByAggregateInput
    _sum?: CommunityDealSumOrderByAggregateInput
  }

  export type CommunityDealScalarWhereWithAggregatesInput = {
    AND?: CommunityDealScalarWhereWithAggregatesInput | CommunityDealScalarWhereWithAggregatesInput[]
    OR?: CommunityDealScalarWhereWithAggregatesInput[]
    NOT?: CommunityDealScalarWhereWithAggregatesInput | CommunityDealScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CommunityDeal"> | string
    productId?: StringWithAggregatesFilter<"CommunityDeal"> | string
    supplierId?: StringWithAggregatesFilter<"CommunityDeal"> | string
    title?: StringWithAggregatesFilter<"CommunityDeal"> | string
    description?: StringWithAggregatesFilter<"CommunityDeal"> | string
    targetQuantity?: IntWithAggregatesFilter<"CommunityDeal"> | number
    currentQuantity?: IntWithAggregatesFilter<"CommunityDeal"> | number
    originalPricePaise?: IntWithAggregatesFilter<"CommunityDeal"> | number
    dealPricePaise?: IntWithAggregatesFilter<"CommunityDeal"> | number
    endsAt?: DateTimeWithAggregatesFilter<"CommunityDeal"> | Date | string
    isActive?: BoolWithAggregatesFilter<"CommunityDeal"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CommunityDeal"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CommunityDeal"> | Date | string
  }

  export type DealParticipantWhereInput = {
    AND?: DealParticipantWhereInput | DealParticipantWhereInput[]
    OR?: DealParticipantWhereInput[]
    NOT?: DealParticipantWhereInput | DealParticipantWhereInput[]
    id?: StringFilter<"DealParticipant"> | string
    dealId?: StringFilter<"DealParticipant"> | string
    farmerId?: StringFilter<"DealParticipant"> | string
    quantity?: IntFilter<"DealParticipant"> | number
    paymentStatus?: EnumPaymentStatusFilter<"DealParticipant"> | $Enums.PaymentStatus
    orderId?: StringNullableFilter<"DealParticipant"> | string | null
    createdAt?: DateTimeFilter<"DealParticipant"> | Date | string
    deal?: XOR<CommunityDealScalarRelationFilter, CommunityDealWhereInput>
  }

  export type DealParticipantOrderByWithRelationInput = {
    id?: SortOrder
    dealId?: SortOrder
    farmerId?: SortOrder
    quantity?: SortOrder
    paymentStatus?: SortOrder
    orderId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    deal?: CommunityDealOrderByWithRelationInput
  }

  export type DealParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    dealId_farmerId?: DealParticipantDealIdFarmerIdCompoundUniqueInput
    AND?: DealParticipantWhereInput | DealParticipantWhereInput[]
    OR?: DealParticipantWhereInput[]
    NOT?: DealParticipantWhereInput | DealParticipantWhereInput[]
    dealId?: StringFilter<"DealParticipant"> | string
    farmerId?: StringFilter<"DealParticipant"> | string
    quantity?: IntFilter<"DealParticipant"> | number
    paymentStatus?: EnumPaymentStatusFilter<"DealParticipant"> | $Enums.PaymentStatus
    orderId?: StringNullableFilter<"DealParticipant"> | string | null
    createdAt?: DateTimeFilter<"DealParticipant"> | Date | string
    deal?: XOR<CommunityDealScalarRelationFilter, CommunityDealWhereInput>
  }, "id" | "dealId_farmerId">

  export type DealParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    dealId?: SortOrder
    farmerId?: SortOrder
    quantity?: SortOrder
    paymentStatus?: SortOrder
    orderId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DealParticipantCountOrderByAggregateInput
    _avg?: DealParticipantAvgOrderByAggregateInput
    _max?: DealParticipantMaxOrderByAggregateInput
    _min?: DealParticipantMinOrderByAggregateInput
    _sum?: DealParticipantSumOrderByAggregateInput
  }

  export type DealParticipantScalarWhereWithAggregatesInput = {
    AND?: DealParticipantScalarWhereWithAggregatesInput | DealParticipantScalarWhereWithAggregatesInput[]
    OR?: DealParticipantScalarWhereWithAggregatesInput[]
    NOT?: DealParticipantScalarWhereWithAggregatesInput | DealParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DealParticipant"> | string
    dealId?: StringWithAggregatesFilter<"DealParticipant"> | string
    farmerId?: StringWithAggregatesFilter<"DealParticipant"> | string
    quantity?: IntWithAggregatesFilter<"DealParticipant"> | number
    paymentStatus?: EnumPaymentStatusWithAggregatesFilter<"DealParticipant"> | $Enums.PaymentStatus
    orderId?: StringNullableWithAggregatesFilter<"DealParticipant"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DealParticipant"> | Date | string
  }

  export type WishlistItemWhereInput = {
    AND?: WishlistItemWhereInput | WishlistItemWhereInput[]
    OR?: WishlistItemWhereInput[]
    NOT?: WishlistItemWhereInput | WishlistItemWhereInput[]
    id?: StringFilter<"WishlistItem"> | string
    farmerId?: StringFilter<"WishlistItem"> | string
    productId?: StringFilter<"WishlistItem"> | string
    supplierId?: StringFilter<"WishlistItem"> | string
    snapshot?: JsonFilter<"WishlistItem">
    addedAt?: DateTimeFilter<"WishlistItem"> | Date | string
  }

  export type WishlistItemOrderByWithRelationInput = {
    id?: SortOrder
    farmerId?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    snapshot?: SortOrder
    addedAt?: SortOrder
  }

  export type WishlistItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    farmerId_productId?: WishlistItemFarmerIdProductIdCompoundUniqueInput
    AND?: WishlistItemWhereInput | WishlistItemWhereInput[]
    OR?: WishlistItemWhereInput[]
    NOT?: WishlistItemWhereInput | WishlistItemWhereInput[]
    farmerId?: StringFilter<"WishlistItem"> | string
    productId?: StringFilter<"WishlistItem"> | string
    supplierId?: StringFilter<"WishlistItem"> | string
    snapshot?: JsonFilter<"WishlistItem">
    addedAt?: DateTimeFilter<"WishlistItem"> | Date | string
  }, "id" | "farmerId_productId">

  export type WishlistItemOrderByWithAggregationInput = {
    id?: SortOrder
    farmerId?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    snapshot?: SortOrder
    addedAt?: SortOrder
    _count?: WishlistItemCountOrderByAggregateInput
    _max?: WishlistItemMaxOrderByAggregateInput
    _min?: WishlistItemMinOrderByAggregateInput
  }

  export type WishlistItemScalarWhereWithAggregatesInput = {
    AND?: WishlistItemScalarWhereWithAggregatesInput | WishlistItemScalarWhereWithAggregatesInput[]
    OR?: WishlistItemScalarWhereWithAggregatesInput[]
    NOT?: WishlistItemScalarWhereWithAggregatesInput | WishlistItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WishlistItem"> | string
    farmerId?: StringWithAggregatesFilter<"WishlistItem"> | string
    productId?: StringWithAggregatesFilter<"WishlistItem"> | string
    supplierId?: StringWithAggregatesFilter<"WishlistItem"> | string
    snapshot?: JsonWithAggregatesFilter<"WishlistItem">
    addedAt?: DateTimeWithAggregatesFilter<"WishlistItem"> | Date | string
  }

  export type OrderCreateInput = {
    id?: string
    orderNumber: string
    farmerId: string
    supplierId: string
    items: JsonNullValueInput | InputJsonValue
    subtotalPaise: number
    taxPaise: number
    shippingPaise: number
    totalPaise: number
    paymentMethod: $Enums.PaymentMethod
    paymentStatus?: $Enums.PaymentStatus
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    paidAt?: Date | string | null
    orderStatus?: $Enums.OrderStatus
    shippingAddress: JsonNullValueInput | InputJsonValue
    trackingNumber?: string | null
    carrier?: string | null
    estimatedDelivery?: Date | string | null
    actualDelivery?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    orderNumber: string
    farmerId: string
    supplierId: string
    items: JsonNullValueInput | InputJsonValue
    subtotalPaise: number
    taxPaise: number
    shippingPaise: number
    totalPaise: number
    paymentMethod: $Enums.PaymentMethod
    paymentStatus?: $Enums.PaymentStatus
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    paidAt?: Date | string | null
    orderStatus?: $Enums.OrderStatus
    shippingAddress: JsonNullValueInput | InputJsonValue
    trackingNumber?: string | null
    carrier?: string | null
    estimatedDelivery?: Date | string | null
    actualDelivery?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderStatus?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    shippingAddress?: JsonNullValueInput | InputJsonValue
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderStatus?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    shippingAddress?: JsonNullValueInput | InputJsonValue
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateManyInput = {
    id?: string
    orderNumber: string
    farmerId: string
    supplierId: string
    items: JsonNullValueInput | InputJsonValue
    subtotalPaise: number
    taxPaise: number
    shippingPaise: number
    totalPaise: number
    paymentMethod: $Enums.PaymentMethod
    paymentStatus?: $Enums.PaymentStatus
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
    razorpaySignature?: string | null
    paidAt?: Date | string | null
    orderStatus?: $Enums.OrderStatus
    shippingAddress: JsonNullValueInput | InputJsonValue
    trackingNumber?: string | null
    carrier?: string | null
    estimatedDelivery?: Date | string | null
    actualDelivery?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderStatus?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    shippingAddress?: JsonNullValueInput | InputJsonValue
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    subtotalPaise?: IntFieldUpdateOperationsInput | number
    taxPaise?: IntFieldUpdateOperationsInput | number
    shippingPaise?: IntFieldUpdateOperationsInput | number
    totalPaise?: IntFieldUpdateOperationsInput | number
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    razorpayOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpayPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    razorpaySignature?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    orderStatus?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    shippingAddress?: JsonNullValueInput | InputJsonValue
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actualDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateInput = {
    id?: string
    farmerId: string
    productId: string
    supplierId: string
    quantity: number
    snapshot: JsonNullValueInput | InputJsonValue
    addedAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemUncheckedCreateInput = {
    id?: string
    farmerId: string
    productId: string
    supplierId: string
    quantity: number
    snapshot: JsonNullValueInput | InputJsonValue
    addedAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    snapshot?: JsonNullValueInput | InputJsonValue
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    snapshot?: JsonNullValueInput | InputJsonValue
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateManyInput = {
    id?: string
    farmerId: string
    productId: string
    supplierId: string
    quantity: number
    snapshot: JsonNullValueInput | InputJsonValue
    addedAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    snapshot?: JsonNullValueInput | InputJsonValue
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    snapshot?: JsonNullValueInput | InputJsonValue
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateInput = {
    id?: string
    productId: string
    supplierId: string
    farmerId: string
    orderId?: string | null
    rating: number
    title: string
    body: string
    isVerified?: boolean
    isFlagged?: boolean
    flagReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewUncheckedCreateInput = {
    id?: string
    productId: string
    supplierId: string
    farmerId: string
    orderId?: string | null
    rating: number
    title: string
    body: string
    isVerified?: boolean
    isFlagged?: boolean
    flagReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isFlagged?: BoolFieldUpdateOperationsInput | boolean
    flagReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isFlagged?: BoolFieldUpdateOperationsInput | boolean
    flagReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateManyInput = {
    id?: string
    productId: string
    supplierId: string
    farmerId: string
    orderId?: string | null
    rating: number
    title: string
    body: string
    isVerified?: boolean
    isFlagged?: boolean
    flagReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isFlagged?: BoolFieldUpdateOperationsInput | boolean
    flagReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isFlagged?: BoolFieldUpdateOperationsInput | boolean
    flagReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryCreateInput = {
    id?: string
    productId?: string | null
    farmerId: string
    supplierId: string
    subject: string
    body: string
    status?: $Enums.InquiryStatus
    lastMessageAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: InquiryReplyCreateNestedManyWithoutInquiryInput
  }

  export type InquiryUncheckedCreateInput = {
    id?: string
    productId?: string | null
    farmerId: string
    supplierId: string
    subject: string
    body: string
    status?: $Enums.InquiryStatus
    lastMessageAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: InquiryReplyUncheckedCreateNestedManyWithoutInquiryInput
  }

  export type InquiryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    farmerId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: InquiryReplyUpdateManyWithoutInquiryNestedInput
  }

  export type InquiryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    farmerId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: InquiryReplyUncheckedUpdateManyWithoutInquiryNestedInput
  }

  export type InquiryCreateManyInput = {
    id?: string
    productId?: string | null
    farmerId: string
    supplierId: string
    subject: string
    body: string
    status?: $Enums.InquiryStatus
    lastMessageAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InquiryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    farmerId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    farmerId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryReplyCreateInput = {
    id?: string
    senderId: string
    senderRole: string
    message: string
    createdAt?: Date | string
    inquiry: InquiryCreateNestedOneWithoutRepliesInput
  }

  export type InquiryReplyUncheckedCreateInput = {
    id?: string
    inquiryId: string
    senderId: string
    senderRole: string
    message: string
    createdAt?: Date | string
  }

  export type InquiryReplyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inquiry?: InquiryUpdateOneRequiredWithoutRepliesNestedInput
  }

  export type InquiryReplyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    inquiryId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryReplyCreateManyInput = {
    id?: string
    inquiryId: string
    senderId: string
    senderRole: string
    message: string
    createdAt?: Date | string
  }

  export type InquiryReplyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryReplyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    inquiryId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityDealCreateInput = {
    id?: string
    productId: string
    supplierId: string
    title: string
    description: string
    targetQuantity: number
    currentQuantity?: number
    originalPricePaise: number
    dealPricePaise: number
    endsAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: DealParticipantCreateNestedManyWithoutDealInput
  }

  export type CommunityDealUncheckedCreateInput = {
    id?: string
    productId: string
    supplierId: string
    title: string
    description: string
    targetQuantity: number
    currentQuantity?: number
    originalPricePaise: number
    dealPricePaise: number
    endsAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: DealParticipantUncheckedCreateNestedManyWithoutDealInput
  }

  export type CommunityDealUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    targetQuantity?: IntFieldUpdateOperationsInput | number
    currentQuantity?: IntFieldUpdateOperationsInput | number
    originalPricePaise?: IntFieldUpdateOperationsInput | number
    dealPricePaise?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: DealParticipantUpdateManyWithoutDealNestedInput
  }

  export type CommunityDealUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    targetQuantity?: IntFieldUpdateOperationsInput | number
    currentQuantity?: IntFieldUpdateOperationsInput | number
    originalPricePaise?: IntFieldUpdateOperationsInput | number
    dealPricePaise?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: DealParticipantUncheckedUpdateManyWithoutDealNestedInput
  }

  export type CommunityDealCreateManyInput = {
    id?: string
    productId: string
    supplierId: string
    title: string
    description: string
    targetQuantity: number
    currentQuantity?: number
    originalPricePaise: number
    dealPricePaise: number
    endsAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommunityDealUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    targetQuantity?: IntFieldUpdateOperationsInput | number
    currentQuantity?: IntFieldUpdateOperationsInput | number
    originalPricePaise?: IntFieldUpdateOperationsInput | number
    dealPricePaise?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityDealUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    targetQuantity?: IntFieldUpdateOperationsInput | number
    currentQuantity?: IntFieldUpdateOperationsInput | number
    originalPricePaise?: IntFieldUpdateOperationsInput | number
    dealPricePaise?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DealParticipantCreateInput = {
    id?: string
    farmerId: string
    quantity: number
    paymentStatus?: $Enums.PaymentStatus
    orderId?: string | null
    createdAt?: Date | string
    deal: CommunityDealCreateNestedOneWithoutParticipantsInput
  }

  export type DealParticipantUncheckedCreateInput = {
    id?: string
    dealId: string
    farmerId: string
    quantity: number
    paymentStatus?: $Enums.PaymentStatus
    orderId?: string | null
    createdAt?: Date | string
  }

  export type DealParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deal?: CommunityDealUpdateOneRequiredWithoutParticipantsNestedInput
  }

  export type DealParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dealId?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DealParticipantCreateManyInput = {
    id?: string
    dealId: string
    farmerId: string
    quantity: number
    paymentStatus?: $Enums.PaymentStatus
    orderId?: string | null
    createdAt?: Date | string
  }

  export type DealParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DealParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dealId?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WishlistItemCreateInput = {
    id?: string
    farmerId: string
    productId: string
    supplierId: string
    snapshot: JsonNullValueInput | InputJsonValue
    addedAt?: Date | string
  }

  export type WishlistItemUncheckedCreateInput = {
    id?: string
    farmerId: string
    productId: string
    supplierId: string
    snapshot: JsonNullValueInput | InputJsonValue
    addedAt?: Date | string
  }

  export type WishlistItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    snapshot?: JsonNullValueInput | InputJsonValue
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WishlistItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    snapshot?: JsonNullValueInput | InputJsonValue
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WishlistItemCreateManyInput = {
    id?: string
    farmerId: string
    productId: string
    supplierId: string
    snapshot: JsonNullValueInput | InputJsonValue
    addedAt?: Date | string
  }

  export type WishlistItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    snapshot?: JsonNullValueInput | InputJsonValue
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WishlistItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    snapshot?: JsonNullValueInput | InputJsonValue
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
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

  export type EnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
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

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    farmerId?: SortOrder
    supplierId?: SortOrder
    items?: SortOrder
    subtotalPaise?: SortOrder
    taxPaise?: SortOrder
    shippingPaise?: SortOrder
    totalPaise?: SortOrder
    paymentMethod?: SortOrder
    paymentStatus?: SortOrder
    razorpayOrderId?: SortOrder
    razorpayPaymentId?: SortOrder
    razorpaySignature?: SortOrder
    paidAt?: SortOrder
    orderStatus?: SortOrder
    shippingAddress?: SortOrder
    trackingNumber?: SortOrder
    carrier?: SortOrder
    estimatedDelivery?: SortOrder
    actualDelivery?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderAvgOrderByAggregateInput = {
    subtotalPaise?: SortOrder
    taxPaise?: SortOrder
    shippingPaise?: SortOrder
    totalPaise?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    farmerId?: SortOrder
    supplierId?: SortOrder
    subtotalPaise?: SortOrder
    taxPaise?: SortOrder
    shippingPaise?: SortOrder
    totalPaise?: SortOrder
    paymentMethod?: SortOrder
    paymentStatus?: SortOrder
    razorpayOrderId?: SortOrder
    razorpayPaymentId?: SortOrder
    razorpaySignature?: SortOrder
    paidAt?: SortOrder
    orderStatus?: SortOrder
    trackingNumber?: SortOrder
    carrier?: SortOrder
    estimatedDelivery?: SortOrder
    actualDelivery?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    farmerId?: SortOrder
    supplierId?: SortOrder
    subtotalPaise?: SortOrder
    taxPaise?: SortOrder
    shippingPaise?: SortOrder
    totalPaise?: SortOrder
    paymentMethod?: SortOrder
    paymentStatus?: SortOrder
    razorpayOrderId?: SortOrder
    razorpayPaymentId?: SortOrder
    razorpaySignature?: SortOrder
    paidAt?: SortOrder
    orderStatus?: SortOrder
    trackingNumber?: SortOrder
    carrier?: SortOrder
    estimatedDelivery?: SortOrder
    actualDelivery?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderSumOrderByAggregateInput = {
    subtotalPaise?: SortOrder
    taxPaise?: SortOrder
    shippingPaise?: SortOrder
    totalPaise?: SortOrder
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

  export type EnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
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

  export type EnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
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

  export type CartItemFarmerIdProductIdCompoundUniqueInput = {
    farmerId: string
    productId: string
  }

  export type CartItemCountOrderByAggregateInput = {
    id?: SortOrder
    farmerId?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    quantity?: SortOrder
    snapshot?: SortOrder
    addedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type CartItemMaxOrderByAggregateInput = {
    id?: SortOrder
    farmerId?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    quantity?: SortOrder
    addedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartItemMinOrderByAggregateInput = {
    id?: SortOrder
    farmerId?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    quantity?: SortOrder
    addedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartItemSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ReviewCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    farmerId?: SortOrder
    orderId?: SortOrder
    rating?: SortOrder
    title?: SortOrder
    body?: SortOrder
    isVerified?: SortOrder
    isFlagged?: SortOrder
    flagReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReviewAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type ReviewMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    farmerId?: SortOrder
    orderId?: SortOrder
    rating?: SortOrder
    title?: SortOrder
    body?: SortOrder
    isVerified?: SortOrder
    isFlagged?: SortOrder
    flagReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReviewMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    farmerId?: SortOrder
    orderId?: SortOrder
    rating?: SortOrder
    title?: SortOrder
    body?: SortOrder
    isVerified?: SortOrder
    isFlagged?: SortOrder
    flagReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReviewSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumInquiryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InquiryStatus | EnumInquiryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInquiryStatusFilter<$PrismaModel> | $Enums.InquiryStatus
  }

  export type InquiryReplyListRelationFilter = {
    every?: InquiryReplyWhereInput
    some?: InquiryReplyWhereInput
    none?: InquiryReplyWhereInput
  }

  export type InquiryReplyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InquiryCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    farmerId?: SortOrder
    supplierId?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    status?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InquiryMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    farmerId?: SortOrder
    supplierId?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    status?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InquiryMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    farmerId?: SortOrder
    supplierId?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    status?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumInquiryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InquiryStatus | EnumInquiryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInquiryStatusWithAggregatesFilter<$PrismaModel> | $Enums.InquiryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInquiryStatusFilter<$PrismaModel>
    _max?: NestedEnumInquiryStatusFilter<$PrismaModel>
  }

  export type InquiryScalarRelationFilter = {
    is?: InquiryWhereInput
    isNot?: InquiryWhereInput
  }

  export type InquiryReplyCountOrderByAggregateInput = {
    id?: SortOrder
    inquiryId?: SortOrder
    senderId?: SortOrder
    senderRole?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type InquiryReplyMaxOrderByAggregateInput = {
    id?: SortOrder
    inquiryId?: SortOrder
    senderId?: SortOrder
    senderRole?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type InquiryReplyMinOrderByAggregateInput = {
    id?: SortOrder
    inquiryId?: SortOrder
    senderId?: SortOrder
    senderRole?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type DealParticipantListRelationFilter = {
    every?: DealParticipantWhereInput
    some?: DealParticipantWhereInput
    none?: DealParticipantWhereInput
  }

  export type DealParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommunityDealCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    targetQuantity?: SortOrder
    currentQuantity?: SortOrder
    originalPricePaise?: SortOrder
    dealPricePaise?: SortOrder
    endsAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommunityDealAvgOrderByAggregateInput = {
    targetQuantity?: SortOrder
    currentQuantity?: SortOrder
    originalPricePaise?: SortOrder
    dealPricePaise?: SortOrder
  }

  export type CommunityDealMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    targetQuantity?: SortOrder
    currentQuantity?: SortOrder
    originalPricePaise?: SortOrder
    dealPricePaise?: SortOrder
    endsAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommunityDealMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    targetQuantity?: SortOrder
    currentQuantity?: SortOrder
    originalPricePaise?: SortOrder
    dealPricePaise?: SortOrder
    endsAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommunityDealSumOrderByAggregateInput = {
    targetQuantity?: SortOrder
    currentQuantity?: SortOrder
    originalPricePaise?: SortOrder
    dealPricePaise?: SortOrder
  }

  export type CommunityDealScalarRelationFilter = {
    is?: CommunityDealWhereInput
    isNot?: CommunityDealWhereInput
  }

  export type DealParticipantDealIdFarmerIdCompoundUniqueInput = {
    dealId: string
    farmerId: string
  }

  export type DealParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    dealId?: SortOrder
    farmerId?: SortOrder
    quantity?: SortOrder
    paymentStatus?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
  }

  export type DealParticipantAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type DealParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    dealId?: SortOrder
    farmerId?: SortOrder
    quantity?: SortOrder
    paymentStatus?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
  }

  export type DealParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    dealId?: SortOrder
    farmerId?: SortOrder
    quantity?: SortOrder
    paymentStatus?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
  }

  export type DealParticipantSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type WishlistItemFarmerIdProductIdCompoundUniqueInput = {
    farmerId: string
    productId: string
  }

  export type WishlistItemCountOrderByAggregateInput = {
    id?: SortOrder
    farmerId?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    snapshot?: SortOrder
    addedAt?: SortOrder
  }

  export type WishlistItemMaxOrderByAggregateInput = {
    id?: SortOrder
    farmerId?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    addedAt?: SortOrder
  }

  export type WishlistItemMinOrderByAggregateInput = {
    id?: SortOrder
    farmerId?: SortOrder
    productId?: SortOrder
    supplierId?: SortOrder
    addedAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.OrderStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type InquiryReplyCreateNestedManyWithoutInquiryInput = {
    create?: XOR<InquiryReplyCreateWithoutInquiryInput, InquiryReplyUncheckedCreateWithoutInquiryInput> | InquiryReplyCreateWithoutInquiryInput[] | InquiryReplyUncheckedCreateWithoutInquiryInput[]
    connectOrCreate?: InquiryReplyCreateOrConnectWithoutInquiryInput | InquiryReplyCreateOrConnectWithoutInquiryInput[]
    createMany?: InquiryReplyCreateManyInquiryInputEnvelope
    connect?: InquiryReplyWhereUniqueInput | InquiryReplyWhereUniqueInput[]
  }

  export type InquiryReplyUncheckedCreateNestedManyWithoutInquiryInput = {
    create?: XOR<InquiryReplyCreateWithoutInquiryInput, InquiryReplyUncheckedCreateWithoutInquiryInput> | InquiryReplyCreateWithoutInquiryInput[] | InquiryReplyUncheckedCreateWithoutInquiryInput[]
    connectOrCreate?: InquiryReplyCreateOrConnectWithoutInquiryInput | InquiryReplyCreateOrConnectWithoutInquiryInput[]
    createMany?: InquiryReplyCreateManyInquiryInputEnvelope
    connect?: InquiryReplyWhereUniqueInput | InquiryReplyWhereUniqueInput[]
  }

  export type EnumInquiryStatusFieldUpdateOperationsInput = {
    set?: $Enums.InquiryStatus
  }

  export type InquiryReplyUpdateManyWithoutInquiryNestedInput = {
    create?: XOR<InquiryReplyCreateWithoutInquiryInput, InquiryReplyUncheckedCreateWithoutInquiryInput> | InquiryReplyCreateWithoutInquiryInput[] | InquiryReplyUncheckedCreateWithoutInquiryInput[]
    connectOrCreate?: InquiryReplyCreateOrConnectWithoutInquiryInput | InquiryReplyCreateOrConnectWithoutInquiryInput[]
    upsert?: InquiryReplyUpsertWithWhereUniqueWithoutInquiryInput | InquiryReplyUpsertWithWhereUniqueWithoutInquiryInput[]
    createMany?: InquiryReplyCreateManyInquiryInputEnvelope
    set?: InquiryReplyWhereUniqueInput | InquiryReplyWhereUniqueInput[]
    disconnect?: InquiryReplyWhereUniqueInput | InquiryReplyWhereUniqueInput[]
    delete?: InquiryReplyWhereUniqueInput | InquiryReplyWhereUniqueInput[]
    connect?: InquiryReplyWhereUniqueInput | InquiryReplyWhereUniqueInput[]
    update?: InquiryReplyUpdateWithWhereUniqueWithoutInquiryInput | InquiryReplyUpdateWithWhereUniqueWithoutInquiryInput[]
    updateMany?: InquiryReplyUpdateManyWithWhereWithoutInquiryInput | InquiryReplyUpdateManyWithWhereWithoutInquiryInput[]
    deleteMany?: InquiryReplyScalarWhereInput | InquiryReplyScalarWhereInput[]
  }

  export type InquiryReplyUncheckedUpdateManyWithoutInquiryNestedInput = {
    create?: XOR<InquiryReplyCreateWithoutInquiryInput, InquiryReplyUncheckedCreateWithoutInquiryInput> | InquiryReplyCreateWithoutInquiryInput[] | InquiryReplyUncheckedCreateWithoutInquiryInput[]
    connectOrCreate?: InquiryReplyCreateOrConnectWithoutInquiryInput | InquiryReplyCreateOrConnectWithoutInquiryInput[]
    upsert?: InquiryReplyUpsertWithWhereUniqueWithoutInquiryInput | InquiryReplyUpsertWithWhereUniqueWithoutInquiryInput[]
    createMany?: InquiryReplyCreateManyInquiryInputEnvelope
    set?: InquiryReplyWhereUniqueInput | InquiryReplyWhereUniqueInput[]
    disconnect?: InquiryReplyWhereUniqueInput | InquiryReplyWhereUniqueInput[]
    delete?: InquiryReplyWhereUniqueInput | InquiryReplyWhereUniqueInput[]
    connect?: InquiryReplyWhereUniqueInput | InquiryReplyWhereUniqueInput[]
    update?: InquiryReplyUpdateWithWhereUniqueWithoutInquiryInput | InquiryReplyUpdateWithWhereUniqueWithoutInquiryInput[]
    updateMany?: InquiryReplyUpdateManyWithWhereWithoutInquiryInput | InquiryReplyUpdateManyWithWhereWithoutInquiryInput[]
    deleteMany?: InquiryReplyScalarWhereInput | InquiryReplyScalarWhereInput[]
  }

  export type InquiryCreateNestedOneWithoutRepliesInput = {
    create?: XOR<InquiryCreateWithoutRepliesInput, InquiryUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: InquiryCreateOrConnectWithoutRepliesInput
    connect?: InquiryWhereUniqueInput
  }

  export type InquiryUpdateOneRequiredWithoutRepliesNestedInput = {
    create?: XOR<InquiryCreateWithoutRepliesInput, InquiryUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: InquiryCreateOrConnectWithoutRepliesInput
    upsert?: InquiryUpsertWithoutRepliesInput
    connect?: InquiryWhereUniqueInput
    update?: XOR<XOR<InquiryUpdateToOneWithWhereWithoutRepliesInput, InquiryUpdateWithoutRepliesInput>, InquiryUncheckedUpdateWithoutRepliesInput>
  }

  export type DealParticipantCreateNestedManyWithoutDealInput = {
    create?: XOR<DealParticipantCreateWithoutDealInput, DealParticipantUncheckedCreateWithoutDealInput> | DealParticipantCreateWithoutDealInput[] | DealParticipantUncheckedCreateWithoutDealInput[]
    connectOrCreate?: DealParticipantCreateOrConnectWithoutDealInput | DealParticipantCreateOrConnectWithoutDealInput[]
    createMany?: DealParticipantCreateManyDealInputEnvelope
    connect?: DealParticipantWhereUniqueInput | DealParticipantWhereUniqueInput[]
  }

  export type DealParticipantUncheckedCreateNestedManyWithoutDealInput = {
    create?: XOR<DealParticipantCreateWithoutDealInput, DealParticipantUncheckedCreateWithoutDealInput> | DealParticipantCreateWithoutDealInput[] | DealParticipantUncheckedCreateWithoutDealInput[]
    connectOrCreate?: DealParticipantCreateOrConnectWithoutDealInput | DealParticipantCreateOrConnectWithoutDealInput[]
    createMany?: DealParticipantCreateManyDealInputEnvelope
    connect?: DealParticipantWhereUniqueInput | DealParticipantWhereUniqueInput[]
  }

  export type DealParticipantUpdateManyWithoutDealNestedInput = {
    create?: XOR<DealParticipantCreateWithoutDealInput, DealParticipantUncheckedCreateWithoutDealInput> | DealParticipantCreateWithoutDealInput[] | DealParticipantUncheckedCreateWithoutDealInput[]
    connectOrCreate?: DealParticipantCreateOrConnectWithoutDealInput | DealParticipantCreateOrConnectWithoutDealInput[]
    upsert?: DealParticipantUpsertWithWhereUniqueWithoutDealInput | DealParticipantUpsertWithWhereUniqueWithoutDealInput[]
    createMany?: DealParticipantCreateManyDealInputEnvelope
    set?: DealParticipantWhereUniqueInput | DealParticipantWhereUniqueInput[]
    disconnect?: DealParticipantWhereUniqueInput | DealParticipantWhereUniqueInput[]
    delete?: DealParticipantWhereUniqueInput | DealParticipantWhereUniqueInput[]
    connect?: DealParticipantWhereUniqueInput | DealParticipantWhereUniqueInput[]
    update?: DealParticipantUpdateWithWhereUniqueWithoutDealInput | DealParticipantUpdateWithWhereUniqueWithoutDealInput[]
    updateMany?: DealParticipantUpdateManyWithWhereWithoutDealInput | DealParticipantUpdateManyWithWhereWithoutDealInput[]
    deleteMany?: DealParticipantScalarWhereInput | DealParticipantScalarWhereInput[]
  }

  export type DealParticipantUncheckedUpdateManyWithoutDealNestedInput = {
    create?: XOR<DealParticipantCreateWithoutDealInput, DealParticipantUncheckedCreateWithoutDealInput> | DealParticipantCreateWithoutDealInput[] | DealParticipantUncheckedCreateWithoutDealInput[]
    connectOrCreate?: DealParticipantCreateOrConnectWithoutDealInput | DealParticipantCreateOrConnectWithoutDealInput[]
    upsert?: DealParticipantUpsertWithWhereUniqueWithoutDealInput | DealParticipantUpsertWithWhereUniqueWithoutDealInput[]
    createMany?: DealParticipantCreateManyDealInputEnvelope
    set?: DealParticipantWhereUniqueInput | DealParticipantWhereUniqueInput[]
    disconnect?: DealParticipantWhereUniqueInput | DealParticipantWhereUniqueInput[]
    delete?: DealParticipantWhereUniqueInput | DealParticipantWhereUniqueInput[]
    connect?: DealParticipantWhereUniqueInput | DealParticipantWhereUniqueInput[]
    update?: DealParticipantUpdateWithWhereUniqueWithoutDealInput | DealParticipantUpdateWithWhereUniqueWithoutDealInput[]
    updateMany?: DealParticipantUpdateManyWithWhereWithoutDealInput | DealParticipantUpdateManyWithWhereWithoutDealInput[]
    deleteMany?: DealParticipantScalarWhereInput | DealParticipantScalarWhereInput[]
  }

  export type CommunityDealCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<CommunityDealCreateWithoutParticipantsInput, CommunityDealUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: CommunityDealCreateOrConnectWithoutParticipantsInput
    connect?: CommunityDealWhereUniqueInput
  }

  export type CommunityDealUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<CommunityDealCreateWithoutParticipantsInput, CommunityDealUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: CommunityDealCreateOrConnectWithoutParticipantsInput
    upsert?: CommunityDealUpsertWithoutParticipantsInput
    connect?: CommunityDealWhereUniqueInput
    update?: XOR<XOR<CommunityDealUpdateToOneWithWhereWithoutParticipantsInput, CommunityDealUpdateWithoutParticipantsInput>, CommunityDealUncheckedUpdateWithoutParticipantsInput>
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

  export type NestedEnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
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

  export type NestedEnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
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

  export type NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
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

  export type NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumInquiryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InquiryStatus | EnumInquiryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInquiryStatusFilter<$PrismaModel> | $Enums.InquiryStatus
  }

  export type NestedEnumInquiryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InquiryStatus | EnumInquiryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInquiryStatusWithAggregatesFilter<$PrismaModel> | $Enums.InquiryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInquiryStatusFilter<$PrismaModel>
    _max?: NestedEnumInquiryStatusFilter<$PrismaModel>
  }

  export type InquiryReplyCreateWithoutInquiryInput = {
    id?: string
    senderId: string
    senderRole: string
    message: string
    createdAt?: Date | string
  }

  export type InquiryReplyUncheckedCreateWithoutInquiryInput = {
    id?: string
    senderId: string
    senderRole: string
    message: string
    createdAt?: Date | string
  }

  export type InquiryReplyCreateOrConnectWithoutInquiryInput = {
    where: InquiryReplyWhereUniqueInput
    create: XOR<InquiryReplyCreateWithoutInquiryInput, InquiryReplyUncheckedCreateWithoutInquiryInput>
  }

  export type InquiryReplyCreateManyInquiryInputEnvelope = {
    data: InquiryReplyCreateManyInquiryInput | InquiryReplyCreateManyInquiryInput[]
    skipDuplicates?: boolean
  }

  export type InquiryReplyUpsertWithWhereUniqueWithoutInquiryInput = {
    where: InquiryReplyWhereUniqueInput
    update: XOR<InquiryReplyUpdateWithoutInquiryInput, InquiryReplyUncheckedUpdateWithoutInquiryInput>
    create: XOR<InquiryReplyCreateWithoutInquiryInput, InquiryReplyUncheckedCreateWithoutInquiryInput>
  }

  export type InquiryReplyUpdateWithWhereUniqueWithoutInquiryInput = {
    where: InquiryReplyWhereUniqueInput
    data: XOR<InquiryReplyUpdateWithoutInquiryInput, InquiryReplyUncheckedUpdateWithoutInquiryInput>
  }

  export type InquiryReplyUpdateManyWithWhereWithoutInquiryInput = {
    where: InquiryReplyScalarWhereInput
    data: XOR<InquiryReplyUpdateManyMutationInput, InquiryReplyUncheckedUpdateManyWithoutInquiryInput>
  }

  export type InquiryReplyScalarWhereInput = {
    AND?: InquiryReplyScalarWhereInput | InquiryReplyScalarWhereInput[]
    OR?: InquiryReplyScalarWhereInput[]
    NOT?: InquiryReplyScalarWhereInput | InquiryReplyScalarWhereInput[]
    id?: StringFilter<"InquiryReply"> | string
    inquiryId?: StringFilter<"InquiryReply"> | string
    senderId?: StringFilter<"InquiryReply"> | string
    senderRole?: StringFilter<"InquiryReply"> | string
    message?: StringFilter<"InquiryReply"> | string
    createdAt?: DateTimeFilter<"InquiryReply"> | Date | string
  }

  export type InquiryCreateWithoutRepliesInput = {
    id?: string
    productId?: string | null
    farmerId: string
    supplierId: string
    subject: string
    body: string
    status?: $Enums.InquiryStatus
    lastMessageAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InquiryUncheckedCreateWithoutRepliesInput = {
    id?: string
    productId?: string | null
    farmerId: string
    supplierId: string
    subject: string
    body: string
    status?: $Enums.InquiryStatus
    lastMessageAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InquiryCreateOrConnectWithoutRepliesInput = {
    where: InquiryWhereUniqueInput
    create: XOR<InquiryCreateWithoutRepliesInput, InquiryUncheckedCreateWithoutRepliesInput>
  }

  export type InquiryUpsertWithoutRepliesInput = {
    update: XOR<InquiryUpdateWithoutRepliesInput, InquiryUncheckedUpdateWithoutRepliesInput>
    create: XOR<InquiryCreateWithoutRepliesInput, InquiryUncheckedCreateWithoutRepliesInput>
    where?: InquiryWhereInput
  }

  export type InquiryUpdateToOneWithWhereWithoutRepliesInput = {
    where?: InquiryWhereInput
    data: XOR<InquiryUpdateWithoutRepliesInput, InquiryUncheckedUpdateWithoutRepliesInput>
  }

  export type InquiryUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    farmerId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryUncheckedUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    farmerId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DealParticipantCreateWithoutDealInput = {
    id?: string
    farmerId: string
    quantity: number
    paymentStatus?: $Enums.PaymentStatus
    orderId?: string | null
    createdAt?: Date | string
  }

  export type DealParticipantUncheckedCreateWithoutDealInput = {
    id?: string
    farmerId: string
    quantity: number
    paymentStatus?: $Enums.PaymentStatus
    orderId?: string | null
    createdAt?: Date | string
  }

  export type DealParticipantCreateOrConnectWithoutDealInput = {
    where: DealParticipantWhereUniqueInput
    create: XOR<DealParticipantCreateWithoutDealInput, DealParticipantUncheckedCreateWithoutDealInput>
  }

  export type DealParticipantCreateManyDealInputEnvelope = {
    data: DealParticipantCreateManyDealInput | DealParticipantCreateManyDealInput[]
    skipDuplicates?: boolean
  }

  export type DealParticipantUpsertWithWhereUniqueWithoutDealInput = {
    where: DealParticipantWhereUniqueInput
    update: XOR<DealParticipantUpdateWithoutDealInput, DealParticipantUncheckedUpdateWithoutDealInput>
    create: XOR<DealParticipantCreateWithoutDealInput, DealParticipantUncheckedCreateWithoutDealInput>
  }

  export type DealParticipantUpdateWithWhereUniqueWithoutDealInput = {
    where: DealParticipantWhereUniqueInput
    data: XOR<DealParticipantUpdateWithoutDealInput, DealParticipantUncheckedUpdateWithoutDealInput>
  }

  export type DealParticipantUpdateManyWithWhereWithoutDealInput = {
    where: DealParticipantScalarWhereInput
    data: XOR<DealParticipantUpdateManyMutationInput, DealParticipantUncheckedUpdateManyWithoutDealInput>
  }

  export type DealParticipantScalarWhereInput = {
    AND?: DealParticipantScalarWhereInput | DealParticipantScalarWhereInput[]
    OR?: DealParticipantScalarWhereInput[]
    NOT?: DealParticipantScalarWhereInput | DealParticipantScalarWhereInput[]
    id?: StringFilter<"DealParticipant"> | string
    dealId?: StringFilter<"DealParticipant"> | string
    farmerId?: StringFilter<"DealParticipant"> | string
    quantity?: IntFilter<"DealParticipant"> | number
    paymentStatus?: EnumPaymentStatusFilter<"DealParticipant"> | $Enums.PaymentStatus
    orderId?: StringNullableFilter<"DealParticipant"> | string | null
    createdAt?: DateTimeFilter<"DealParticipant"> | Date | string
  }

  export type CommunityDealCreateWithoutParticipantsInput = {
    id?: string
    productId: string
    supplierId: string
    title: string
    description: string
    targetQuantity: number
    currentQuantity?: number
    originalPricePaise: number
    dealPricePaise: number
    endsAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommunityDealUncheckedCreateWithoutParticipantsInput = {
    id?: string
    productId: string
    supplierId: string
    title: string
    description: string
    targetQuantity: number
    currentQuantity?: number
    originalPricePaise: number
    dealPricePaise: number
    endsAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommunityDealCreateOrConnectWithoutParticipantsInput = {
    where: CommunityDealWhereUniqueInput
    create: XOR<CommunityDealCreateWithoutParticipantsInput, CommunityDealUncheckedCreateWithoutParticipantsInput>
  }

  export type CommunityDealUpsertWithoutParticipantsInput = {
    update: XOR<CommunityDealUpdateWithoutParticipantsInput, CommunityDealUncheckedUpdateWithoutParticipantsInput>
    create: XOR<CommunityDealCreateWithoutParticipantsInput, CommunityDealUncheckedCreateWithoutParticipantsInput>
    where?: CommunityDealWhereInput
  }

  export type CommunityDealUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: CommunityDealWhereInput
    data: XOR<CommunityDealUpdateWithoutParticipantsInput, CommunityDealUncheckedUpdateWithoutParticipantsInput>
  }

  export type CommunityDealUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    targetQuantity?: IntFieldUpdateOperationsInput | number
    currentQuantity?: IntFieldUpdateOperationsInput | number
    originalPricePaise?: IntFieldUpdateOperationsInput | number
    dealPricePaise?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityDealUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    targetQuantity?: IntFieldUpdateOperationsInput | number
    currentQuantity?: IntFieldUpdateOperationsInput | number
    originalPricePaise?: IntFieldUpdateOperationsInput | number
    dealPricePaise?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryReplyCreateManyInquiryInput = {
    id?: string
    senderId: string
    senderRole: string
    message: string
    createdAt?: Date | string
  }

  export type InquiryReplyUpdateWithoutInquiryInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryReplyUncheckedUpdateWithoutInquiryInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InquiryReplyUncheckedUpdateManyWithoutInquiryInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DealParticipantCreateManyDealInput = {
    id?: string
    farmerId: string
    quantity: number
    paymentStatus?: $Enums.PaymentStatus
    orderId?: string | null
    createdAt?: Date | string
  }

  export type DealParticipantUpdateWithoutDealInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DealParticipantUncheckedUpdateWithoutDealInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DealParticipantUncheckedUpdateManyWithoutDealInput = {
    id?: StringFieldUpdateOperationsInput | string
    farmerId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
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