/**
 * @agrilink/types
 * Shared TypeScript interfaces for all AgriLink v2 microservices.
 * This is the single source of truth for all data shapes.
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
    details?: Record<string, string[]>;
}
export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export type UserRole = 'farmer' | 'supplier' | 'admin';
export type KycStatus = 'not_started' | 'pending' | 'approved' | 'rejected';
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
    jti: string;
    tokenVersion: number;
    iat: number;
    exp: number;
}
export interface UserDto {
    id: string;
    email: string;
    phone: string;
    role: UserRole;
    fullName?: string;
    companyName?: string;
    displayName: string;
    emailVerified: boolean;
    kycStatus: KycStatus;
    isActive: boolean;
    createdAt: string;
}
export interface RegisterFarmerDto {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}
export interface RegisterSupplierDto {
    companyName: string;
    email: string;
    phone: string;
    password: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface LoginResponseDto {
    user: UserDto;
    accessToken: string;
}
export interface OtpVerifyDto {
    userId: string;
    otp: string;
}
export interface OtpResendDto {
    userId: string;
}
export interface ForgotPasswordDto {
    email: string;
}
export interface ResetPasswordDto {
    email: string;
    token: string;
    newPassword: string;
}
export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export type NameMatchStatus = 'pending' | 'matched' | 'mismatch' | 'manual_override';
export type FarmerKycStatus = 'not_started' | 'partially_uploaded' | 'submitted' | 'approved' | 'rejected';
export interface FarmerProfileDto {
    userId: string;
    nameEnglish?: string;
    nameKannada?: string;
    nameDisplay?: string;
    nameNormalized?: string;
    dob?: string;
    gender?: string;
    aadhaarAddress?: string;
    aadhaarVerified: boolean;
    aadhaarCloudUrl?: string;
    aadhaarDocCid?: string;
    district?: string;
    taluk?: string;
    hobli?: string;
    village?: string;
    surveyNumber?: string;
    hissaNumber?: string;
    totalExtentRaw?: string;
    totalExtentAcres?: number;
    soilType?: string;
    irrigationType?: string;
    rtcOwnerName?: string;
    rtcVerified: boolean;
    rtcCloudUrl?: string;
    rtcDocCid?: string;
    nameMatchConfidence?: number;
    nameMatchStatus: NameMatchStatus;
    kycStatus: FarmerKycStatus;
    kycSubmittedAt?: string;
    kycApprovedAt?: string;
    readyToIntegrate: boolean;
}
export interface FarmerStatsDto {
    totalLandAcres: number;
    kycStatus: FarmerKycStatus;
    rtcVerified: boolean;
    aadhaarVerified: boolean;
    readyToIntegrate: boolean;
    nameMatchStatus: NameMatchStatus;
}
export type ProductCategory = 'seeds' | 'fertilizers' | 'pesticides' | 'tools' | 'irrigation' | 'machinery' | 'organic' | 'other';
export type VerificationStatus = 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
export interface AddressDto {
    street?: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    country: string;
}
export interface ProductDto {
    id: string;
    supplierId: string;
    name: string;
    slug: string;
    sku: string;
    category: ProductCategory;
    description: string;
    price: number;
    mrp: number;
    unit: string;
    stockQuantity: number;
    reorderThreshold: number;
    images: string[];
    tags: string[];
    status: 'active' | 'inactive' | 'draft';
    rating?: number;
    reviewCount?: number;
    createdAt: string;
    updatedAt: string;
}
export interface SupplierDto {
    id: string;
    userId: string;
    companyName: string;
    email: string;
    phone: string;
    gstNumber?: string;
    address: AddressDto;
    kycStatus: VerificationStatus;
    isActive: boolean;
}
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED' | 'CANCELLED';
export interface OrderItemDto {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    unitPricePaise: number;
    totalPaise: number;
    imageUrl?: string;
}
export interface OrderDto {
    id: string;
    orderNumber: string;
    farmerId: string;
    supplierId: string;
    items: OrderItemDto[];
    subtotalPaise: number;
    taxPaise: number;
    shippingPaise: number;
    totalPaise: number;
    paymentMethod: 'RAZORPAY' | 'COD';
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    shippingAddress: AddressDto;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CartItemDto {
    id: string;
    farmerId: string;
    productId: string;
    supplierId: string;
    quantity: number;
    snapshot: ProductDto;
    addedAt: string;
}
export type AgreementStatus = 0 | 1 | 2;
export interface AgreementPartyDto {
    userId: string;
    name: string;
    address: `0x${string}`;
    surveyNumber: string;
    centiacres: number;
    sharePercent: number;
}
export interface LandAgreementDto {
    agreementId: string;
    creator: `0x${string}`;
    farmer1: AgreementPartyDto;
    farmer2: AgreementPartyDto;
    documentCid: string;
    metadataCid?: string;
    status: AgreementStatus;
    signatureCount: number;
    createdAt: number;
    startTimestamp: number;
    endTimestamp: number;
}
export type KafkaTopic = 'order.placed' | 'order.status.updated' | 'kyc.submitted' | 'kyc.approved' | 'kyc.rejected' | 'land.agreement.created' | 'land.agreement.signed' | 'notification.send' | 'user.registered';
export interface KafkaEvent<T = unknown> {
    eventId: string;
    topic: KafkaTopic | string;
    source: string;
    timestamp: string;
    data: T;
}
export interface UserRegisteredEvent {
    userId: string;
    email: string;
    phone: string;
    role: UserRole;
    displayName: string;
    registeredAt: string;
}
export interface KycSubmittedEvent {
    userId: string;
    email: string;
    phone: string;
    role: UserRole;
    displayName: string;
    verifiedAt: string;
}
export interface KycDecidedEvent {
    userId: string;
    email: string;
    phone: string;
    role: UserRole;
    displayName: string;
    decidedAt: string;
    decisionBy: string;
    reason?: string;
}
export type KycApprovedEvent = KycDecidedEvent;
export type KycRejectedEvent = KycDecidedEvent & {
    reason: string;
};
export interface OrderPlacedEvent {
    orderId: string;
    orderNumber: string;
    farmerId: string;
    email: string;
    phone: string;
    supplierId: string;
    items: OrderItemDto[];
    totalAmount: number;
    paidAt: string;
}
export interface OrderStatusUpdatedEvent {
    orderId: string;
    orderNumber: string;
    farmerId: string;
    email: string;
    phone: string;
    previousStatus: OrderStatus;
    newStatus: OrderStatus;
    trackingNumber?: string;
    carrier?: string;
    updatedAt: string;
}
export interface LandAgreementCreatedEvent {
    agreementId: string;
    farmer1UserId: string;
    farmer1Email: string;
    farmer1Phone: string;
    farmer2UserId: string;
    farmer2Email: string;
    farmer2Phone: string;
    txHash: string;
    createdAt: string;
}
export interface LandAgreementSignedEvent {
    agreementId: string;
    signerUserId: string;
    signerEmail: string;
    signerPhone: string;
    signerName: string;
    txHash: string;
    fullyExecuted: boolean;
    signedAt: string;
}
export interface NotificationSendEvent {
    userId?: string;
    email?: string;
    phone?: string;
    channels: ReadonlyArray<'email' | 'sms'>;
    subject: string;
    body: string;
    metadata?: Record<string, unknown>;
}
export interface AadhaarExtractedData {
    nameEnglish?: string;
    nameKannada?: string;
    nameDisplay: string;
    nameNormalized: string;
    dob?: string;
    gender?: string;
    address?: string;
    confidence: number;
    rawText?: string;
}
export interface RtcExtractedData {
    location?: {
        district?: string;
        taluk?: string;
        hobli?: string;
        village?: string;
    };
    landIdentification?: {
        survey_number?: string;
        hissa_number?: string;
    };
    landDetails?: {
        total_extent?: string;
        soil_type?: string;
        irrigation?: string;
    };
    ownership?: {
        owners?: string[];
        shares?: string[];
    };
    confidence: number;
    rawText?: string;
}
export interface CropPricePrediction {
    cropName: string;
    predictedPricePer100kg: number;
    currency: 'INR';
    forecastMonths: number;
    predictions: {
        month: string;
        price: number;
        lowerBound: number;
        upperBound: number;
    }[];
    modelConfidence: number;
}
export interface NotificationLogDto {
    id: string;
    userId?: string;
    topic: string;
    channel: 'email' | 'sms';
    recipient: string;
    subject?: string;
    status: 'sent' | 'failed' | 'skipped';
    errorMessage?: string;
    retryCount: number;
    messageId?: string;
    createdAt: string;
}
