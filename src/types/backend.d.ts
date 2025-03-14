export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

export interface IContactRequest {
    id?: number;
    fullName: string;
    position: string;
    email: string;
    phone: string;
    companyName: string;
    companyLocation: string;
    website: string;
    status: string;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface IModelPaginate<T> {
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: T[];
}

export interface IContactRequest {
    id?: number;
    fullName: string;
    position: string;
    email: string;
    phone: string;
    companyName: string;
    companyLocation: string;
    website: string;
    status: string;
    userId: number;
    isEmailSent: boolean;
    emailSentAt: string;
    createdAt: string;
}

export interface IAccount {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: {
            id: string;
            name: string;
            permissions: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[];
        };
    };
}

export interface IHrStatus {
    isHrRole: boolean;
    isHrActivated?: boolean;
    message: string;
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface ICompany {
    id?: string;
    name?: string;
    address?: string;
    logo: string;
    description?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISkill {
    id?: string;
    name?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}
// Thêm interface cho kết quả kiểm tra email
export interface ICheckEmailResult {
    message: string;
    exists: boolean;
    userData?: IUser;
}
export interface IUser {
    id?: string;
    name: string;
    email: string;
    password?: string;
    age: number;
    phoneNumber: string;
    urlAvatar: string;
    urlProfile: string;
    gender: string;
    address: string;
    post_count?: number;
    role?: {
        id: string;
        name: string;
    };

    company?: {
        id: string;
        name: string;
        logo: string;
    };
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IJob {
    id?: string;
    name: string;
    skills: ISkill[];
    company?: {
        id: string;
        name: string;
        logo?: string;
    };
    location: string;
    salary: number;
    quantity: number;
    level: string;
    description: string;
    startDate: Date;
    endDate: Date;
    active: boolean;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IJobSaves {
    company: {
        id: number;
        name: string;
        logo: string;
    };
    job: {
        id: number;
        name: string;
        location: string;
        salary: number;
        level: string;
        startDate: string;
        endDate: string;
    };
    skills: {
        id: number;
        name: string;
    }[];
    status: string;
}
export interface IResume {
    id?: string;
    email: string;
    userId: string;
    url: string;
    status: string;
    companyId:
        | string
        | {
              id: string;
              name: string;
              logo: string;
          };
    jobId:
        | string
        | {
              id: string;
              name: string;
          };
    history?: {
        status: string;
        updatedAt: Date;
        updatedBy: { id: string; email: string };
    }[];
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ResumeDetailDTO {
    url: string;
    status: string;
    createdAt: string;
    level: string;
    location: string;
    jobName: string;
    jobId: number;
    salary: number;
    companyName: string;
    companyLogo: string;
    skillNames: string[];
}

export interface IPermission {
    id?: string;
    name?: string;
    apiPath?: string;
    method?: string;

    module?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IRole {
    id?: string;
    name: string;
    description: string;
    active: boolean;
    permissions: IPermission[] | string[];

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISubscribers {
    id?: string;
    name?: string;
    email?: string;
    skills: { id: number }[];
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IPostLimit {
    id: number;
    planName: string;
    maxPostsPerMonth: number;
    price: number;
    description: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface IPaymentRequest {
    planId: number;
    amount: number;
    orderInfo: string;
    months: number;
}

export interface IPayment {
    id: number;
    paymentRef: string;
    totalPrice: number;
    transferContent: string;
    createdAt: string;
    updatedAt: string;
    paymentStatus: string;
    paymentMethod: string;
    user: {
        id: number;
        email: string;
        name: string;
    };
}

interface IPaymentData {
    message: string;
    data: IPayment[];
    code: string;
}
export interface IPlanSalesDTO {
    month: number;
    planName: string;
    totalSales: number;
}

export interface IPlanSalesResponse {
    code: string;
    data: IPlanSalesDTO[];
    message: string;
}

// Interface cho subscription data
export interface ISubscription {
    postLimitID: number;
    planName: string;
    status: string; // 'ACTIVE' | 'INACTIVE'
    timeRemainingInSeconds: number;
}

interface ExpirationInfo {
    formattedDate: string;
    daysRemaining: number;
}
