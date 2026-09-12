import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum ProjectApprovalStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
};



export interface AdminListProjectsData {
  projects: ({
    id: UUIDString;
    name: string;
    description: string;
    features?: string | null;
    approvalStatus: ProjectApprovalStatus;
    progressPercent: number;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    user: {
      uid: string;
      username: string;
      email: string;
    } & User_Key;
    category: {
      id: UUIDString;
      name: string;
    } & Category_Key;
    phase: {
      id: UUIDString;
      name: string;
      description?: string | null;
      orderIndex: number;
    } & Phase_Key;
  } & Project_Key)[];
}

export interface AdminSetProjectApprovalData {
  project_update?: Project_Key | null;
}

export interface AdminSetProjectApprovalVariables {
  id: UUIDString;
  approvalStatus: ProjectApprovalStatus;
}

export interface AdminUpdateProjectData {
  project_update?: Project_Key | null;
}

export interface AdminUpdateProjectPhaseData {
  project_update?: Project_Key | null;
}

export interface AdminUpdateProjectPhaseVariables {
  id: UUIDString;
  phaseId: UUIDString;
  progressPercent: number;
}

export interface AdminUpdateProjectVariables {
  id: UUIDString;
  name: string;
  description: string;
  features?: string | null;
  categoryId: UUIDString;
}

export interface AuditLog_Key {
  id: UUIDString;
  __typename?: 'AuditLog_Key';
}

export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateProjectData {
  project_insert: Project_Key;
}

export interface CreateProjectVariables {
  name: string;
  description: string;
  features?: string | null;
  categoryId: UUIDString;
  phaseId: UUIDString;
}

export interface GetMyProfileData {
  user?: {
    uid: string;
    username: string;
    email: string;
    isAdmin: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & User_Key;
}

export interface ListMyAuditLogsData {
  auditLogs: ({
    id: UUIDString;
    message: string;
    createdAt: TimestampString;
    project: {
      id: UUIDString;
      name: string;
    } & Project_Key;
  } & AuditLog_Key)[];
}

export interface ListMyProjectsData {
  projects: ({
    id: UUIDString;
    name: string;
    description: string;
    features?: string | null;
    approvalStatus: ProjectApprovalStatus;
    progressPercent: number;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    category: {
      id: UUIDString;
      name: string;
    } & Category_Key;
    phase: {
      id: UUIDString;
      name: string;
      description?: string | null;
      orderIndex: number;
    } & Phase_Key;
  } & Project_Key)[];
}

export interface LoadProjectFormOptionsData {
  categories: ({
    id: UUIDString;
    name: string;
    description?: string | null;
  } & Category_Key)[];
  phases: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    orderIndex: number;
  } & Phase_Key)[];
}

export interface Phase_Key {
  id: UUIDString;
  __typename?: 'Phase_Key';
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface UpdateMyProjectData {
  project_update?: Project_Key | null;
}

export interface UpdateMyProjectVariables {
  id: UUIDString;
  name: string;
  description: string;
  features?: string | null;
  categoryId: UUIDString;
}

export interface UpsertMyProfileData {
  user_upsert: User_Key;
}

export interface UpsertMyProfileVariables {
  username: string;
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

interface UpsertMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMyProfileVariables): MutationRef<UpsertMyProfileData, UpsertMyProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertMyProfileVariables): MutationRef<UpsertMyProfileData, UpsertMyProfileVariables>;
  operationName: string;
}
export const upsertMyProfileRef: UpsertMyProfileRef;

export function upsertMyProfile(vars: UpsertMyProfileVariables): MutationPromise<UpsertMyProfileData, UpsertMyProfileVariables>;
export function upsertMyProfile(dc: DataConnect, vars: UpsertMyProfileVariables): MutationPromise<UpsertMyProfileData, UpsertMyProfileVariables>;

interface CreateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
  operationName: string;
}
export const createProjectRef: CreateProjectRef;

export function createProject(vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;
export function createProject(dc: DataConnect, vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface UpdateMyProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMyProjectVariables): MutationRef<UpdateMyProjectData, UpdateMyProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMyProjectVariables): MutationRef<UpdateMyProjectData, UpdateMyProjectVariables>;
  operationName: string;
}
export const updateMyProjectRef: UpdateMyProjectRef;

export function updateMyProject(vars: UpdateMyProjectVariables): MutationPromise<UpdateMyProjectData, UpdateMyProjectVariables>;
export function updateMyProject(dc: DataConnect, vars: UpdateMyProjectVariables): MutationPromise<UpdateMyProjectData, UpdateMyProjectVariables>;

interface AdminUpdateProjectPhaseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateProjectPhaseVariables): MutationRef<AdminUpdateProjectPhaseData, AdminUpdateProjectPhaseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminUpdateProjectPhaseVariables): MutationRef<AdminUpdateProjectPhaseData, AdminUpdateProjectPhaseVariables>;
  operationName: string;
}
export const adminUpdateProjectPhaseRef: AdminUpdateProjectPhaseRef;

export function adminUpdateProjectPhase(vars: AdminUpdateProjectPhaseVariables): MutationPromise<AdminUpdateProjectPhaseData, AdminUpdateProjectPhaseVariables>;
export function adminUpdateProjectPhase(dc: DataConnect, vars: AdminUpdateProjectPhaseVariables): MutationPromise<AdminUpdateProjectPhaseData, AdminUpdateProjectPhaseVariables>;

interface AdminSetProjectApprovalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminSetProjectApprovalVariables): MutationRef<AdminSetProjectApprovalData, AdminSetProjectApprovalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminSetProjectApprovalVariables): MutationRef<AdminSetProjectApprovalData, AdminSetProjectApprovalVariables>;
  operationName: string;
}
export const adminSetProjectApprovalRef: AdminSetProjectApprovalRef;

export function adminSetProjectApproval(vars: AdminSetProjectApprovalVariables): MutationPromise<AdminSetProjectApprovalData, AdminSetProjectApprovalVariables>;
export function adminSetProjectApproval(dc: DataConnect, vars: AdminSetProjectApprovalVariables): MutationPromise<AdminSetProjectApprovalData, AdminSetProjectApprovalVariables>;

interface AdminUpdateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateProjectVariables): MutationRef<AdminUpdateProjectData, AdminUpdateProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminUpdateProjectVariables): MutationRef<AdminUpdateProjectData, AdminUpdateProjectVariables>;
  operationName: string;
}
export const adminUpdateProjectRef: AdminUpdateProjectRef;

export function adminUpdateProject(vars: AdminUpdateProjectVariables): MutationPromise<AdminUpdateProjectData, AdminUpdateProjectVariables>;
export function adminUpdateProject(dc: DataConnect, vars: AdminUpdateProjectVariables): MutationPromise<AdminUpdateProjectData, AdminUpdateProjectVariables>;

interface LoadProjectFormOptionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<LoadProjectFormOptionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<LoadProjectFormOptionsData, undefined>;
  operationName: string;
}
export const loadProjectFormOptionsRef: LoadProjectFormOptionsRef;

export function loadProjectFormOptions(options?: ExecuteQueryOptions): QueryPromise<LoadProjectFormOptionsData, undefined>;
export function loadProjectFormOptions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<LoadProjectFormOptionsData, undefined>;

interface GetMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
  operationName: string;
}
export const getMyProfileRef: GetMyProfileRef;

export function getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;
export function getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface ListMyProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyProjectsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyProjectsData, undefined>;
  operationName: string;
}
export const listMyProjectsRef: ListMyProjectsRef;

export function listMyProjects(options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, undefined>;
export function listMyProjects(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, undefined>;

interface ListMyAuditLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyAuditLogsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyAuditLogsData, undefined>;
  operationName: string;
}
export const listMyAuditLogsRef: ListMyAuditLogsRef;

export function listMyAuditLogs(options?: ExecuteQueryOptions): QueryPromise<ListMyAuditLogsData, undefined>;
export function listMyAuditLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyAuditLogsData, undefined>;

interface AdminListProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListProjectsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListProjectsData, undefined>;
  operationName: string;
}
export const adminListProjectsRef: AdminListProjectsRef;

export function adminListProjects(options?: ExecuteQueryOptions): QueryPromise<AdminListProjectsData, undefined>;
export function adminListProjects(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListProjectsData, undefined>;

