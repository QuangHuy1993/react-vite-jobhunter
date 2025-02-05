import {
    IBackendRes,
    ICompany,
    IAccount,
    IUser,
    IModelPaginate,
    IGetAccount,
    IJob,
    IResume,
    IPermission,
    IRole,
    ISkill,
    ISubscribers,
    IPaymentRequest,
    ISubscription,
    IPostLimit, IPaymentData, IPlanSalesDTO, IPlanSalesResponse,

} from '@/types/backend';
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string, age: number, gender: string, address: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password, age, gender, address })
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}


/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

/**
 * Download file
 */
export const callDownloadFile = (fileName: string, folder: string) => {
    return axios({
        url: '/api/v1/files',
        method: 'GET',
        params: {
            fileName,
            folder
        },
        responseType: 'blob'  // Quan trọng: phải set responseType là blob để nhận file
    });
}




/**
 * 
Module Company
 */
export const callCreateCompany = (name: string, address: string, description: string, logo: string) => {
    return axios.post<IBackendRes<ICompany>>('/api/v1/companies', { name, address, description, logo })
}

export const callUpdateCompany = (id: string, name: string, address: string, description: string, logo: string) => {
    return axios.put<IBackendRes<ICompany>>(`/api/v1/companies`, { id, name, address, description, logo })
}

export const callDeleteCompany = (id: string) => {
    return axios.delete<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
}

export const callFetchCompany = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICompany>>>(`/api/v1/companies?${query}`);
}

export const callFetchCompanyById = (id: string) => {
    return axios.get<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
}

/**
 * 
Module Skill
 */
export const callCreateSkill = (name: string) => {
    return axios.post<IBackendRes<ISkill>>('/api/v1/skills', { name })
}

export const callUpdateSkill = (id: string, name: string) => {
    return axios.put<IBackendRes<ISkill>>(`/api/v1/skills`, { id, name })
}

export const callDeleteSkill = (id: string) => {
    return axios.delete<IBackendRes<ISkill>>(`/api/v1/skills/${id}`);
}

export const callFetchAllSkill = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISkill>>>(`/api/v1/skills?${query}`);
}



/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', { ...user })
}

export const callUpdateUser = (user: IUser) => {
    return axios.put<IBackendRes<IUser>>(`/api/v1/users/update`, { ...user })
}

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}

export const callChangePassword = (id: string|number, data: { currentPassword: string; newPassword: string }) => {
    return axios.put<IBackendRes<any>>(`/api/v1/users/${id}/change-password`, data);
}
export const callFetchUserById = (id: string | number) => {
    return axios.get<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}
export const callFetchPostCountByUserId = (id: string) => {
    return axios.get<IBackendRes<number>>(`/api/v1/users/post_count/${id}`);
};

/**
 * 
Module Job
 */
export const callCreateJob = (job: IJob) => {
    return axios.post<IBackendRes<IJob>>('/api/v1/jobs', { ...job })
}

export const callUpdateJob = (job: IJob, id: string) => {
    return axios.put<IBackendRes<IJob>>(`/api/v1/jobs`, { id, ...job })
}

export const callDeleteJob = (id: string) => {
    return axios.delete<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
}

export const callFetchJob = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`);
}

export const callFetchJobById = (id: string) => {
    return axios.get<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
}

export const callFetchJobsBySkillId = (skillId: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs/skills/${skillId}`);
}

export const callFetchJobsByLocation = (location: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs/location/${location}`);
}

export const callFetchRandomJobs = () => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>('/api/v1/jobs/random');
}

/**
 * Fetch jobs by HR user ID
 */
export const callFetchJobsByHRUserId = (userId: string) => {
    return axios.get<IBackendRes<IJob[]>>(`/api/v1/jobs/hr/${userId}`);
}

/**
 * 
Module Resume
 */
export const callCreateResume = (url: string, jobId: any, email: string, userId: string | number) => {
    return axios.post<IBackendRes<IResume>>('/api/v1/resumes', {
        email, url,
        status: "PENDING",
        user: {
            "id": userId
        },
        job: {
            "id": jobId
        }
    })
}

export const callUpdateResumeStatus = (id: any, status: string) => {
    return axios.put<IBackendRes<IResume>>(`/api/v1/resumes`, { id, status })
}

export const callDeleteResume = (id: string) => {
    return axios.delete<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResume = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes?${query}`);
}

export const callFetchResumeById = (id: string) => {
    return axios.get<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResumeByUser = () => {
    return axios.post<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes/by-user`);
}

export const callFetchResumesByHRUserId = (userId: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes/by-hr/${userId}`);
}



/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.put<IBackendRes<IPermission>>(`/api/v1/permissions`, { id, ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.put<IBackendRes<IRole>>(`/api/v1/roles`, { id, ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

/**
 * 
Module Subscribers
 */
export const callCreateSubscriber = (subs: ISubscribers) => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers', { ...subs })
}

export const callGetSubscriberSkills = () => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers/skills')
}

export const callUpdateSubscriber = (subs: ISubscribers) => {
    return axios.put<IBackendRes<ISubscribers>>(`/api/v1/subscribers`, { ...subs })
}

export const callDeleteSubscriber = (id: string) => {
    return axios.delete<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

export const callFetchSubscriber = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISubscribers>>>(`/api/v1/subscribers?${query}`);
}

export const callFetchSubscriberById = (id: string) => {
    return axios.get<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

/**
 *
 Module Email
 */
export const callCheckEmail = (email: string) => {
    return axios.get<IBackendRes<boolean>>(`/api/v1/email/check`, {
        params: { email }
    });
}

//  API gửi mã OTP
export const callSendOTP = (email: string) => {
    return axios.post<IBackendRes<any>>(`/api/v1/email/send-otp`, null, {
        params: { email }
    });
}

//  API verify mã OTP
export const callVerifyOTP = (email: string, otpCode: string) => {
    return axios.post<IBackendRes<any>>(`/api/v1/email/verify-otp`, {
        email,
        otpCode
    });
}
//  API reset password
export const callResetPassword = (email: string, newPassword: string) => {
    return axios.post<IBackendRes<any>>('/api/v1/users/reset-password', {
        email,
        newPassword
    });
}

/**
 *
 * Module PostLimit
 * */
export const callFetchPostLimits = (query?: string) => {
    const url = query ? `/api/v1/post-limits?${query}` : '/api/v1/post-limits';
    return axios.get(url);
};

export const callCreatePostLimit = (postLimit: IPostLimit) => {
    return axios.post<IBackendRes<IPostLimit>>('/api/v1/post-limits', postLimit);
}


export const callDeletePostLimit = (id: number) => {
    return axios.delete<IBackendRes<string>>(`/api/v1/post-limits/${id}`);
}


export const callUpdatePostLimit = (id: number, postLimit: IPostLimit) => {
    return axios.put<IBackendRes<IPostLimit>>(`/api/v1/post-limits/${id}`, postLimit);
}



/**
 *
 * Module Payment
 * */
export const callCreatePayment = (data: IPaymentRequest) => {
    return axios.post('/api/v1/payments/create-url', data);
};


export const callGetPaymentSuccess = () => {
    return axios.get<IBackendRes<IPaymentData>>('/api/v1/payments/success');
};

export const callGetAllPayments = (query: string) => {
    return axios.get<IBackendRes<IPaymentData>>(`/api/v1/payments?${query}`);
};

export const callUpdatePaymentStatus = (id: number, status: string) => {
    return axios.put<IBackendRes<IPaymentData>>(`/api/v1/payments/update/${id}`, { status });
};
export const callGetPaymentPlanSales = (year: number) => {
    return axios.get<IBackendRes<IPlanSalesResponse>>('/api/v1/payments/plansales', {
        params: { year }
    });
};



``
/**
 *
 * Module Subscription
 * */
export const callFetchSubscriptionStatus = (userId: string) => {
    return axios.get<IBackendRes<ISubscription>>(`/api/v1/subscriptions/${userId}`);
};