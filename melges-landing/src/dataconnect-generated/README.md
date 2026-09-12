# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*LoadProjectFormOptions*](#loadprojectformoptions)
  - [*GetMyProfile*](#getmyprofile)
  - [*ListMyProjects*](#listmyprojects)
  - [*ListMyAuditLogs*](#listmyauditlogs)
  - [*AdminListProjects*](#adminlistprojects)
- [**Mutations**](#mutations)
  - [*UpsertMyProfile*](#upsertmyprofile)
  - [*CreateProject*](#createproject)
  - [*UpdateMyProject*](#updatemyproject)
  - [*AdminUpdateProjectPhase*](#adminupdateprojectphase)
  - [*AdminSetProjectApproval*](#adminsetprojectapproval)
  - [*AdminUpdateProject*](#adminupdateproject)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## LoadProjectFormOptions
You can execute the `LoadProjectFormOptions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
loadProjectFormOptions(options?: ExecuteQueryOptions): QueryPromise<LoadProjectFormOptionsData, undefined>;

interface LoadProjectFormOptionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<LoadProjectFormOptionsData, undefined>;
}
export const loadProjectFormOptionsRef: LoadProjectFormOptionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
loadProjectFormOptions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<LoadProjectFormOptionsData, undefined>;

interface LoadProjectFormOptionsRef {
  ...
  (dc: DataConnect): QueryRef<LoadProjectFormOptionsData, undefined>;
}
export const loadProjectFormOptionsRef: LoadProjectFormOptionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the loadProjectFormOptionsRef:
```typescript
const name = loadProjectFormOptionsRef.operationName;
console.log(name);
```

### Variables
The `LoadProjectFormOptions` query has no variables.
### Return Type
Recall that executing the `LoadProjectFormOptions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LoadProjectFormOptionsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `LoadProjectFormOptions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, loadProjectFormOptions } from '@dataconnect/generated';


// Call the `loadProjectFormOptions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await loadProjectFormOptions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await loadProjectFormOptions(dataConnect);

console.log(data.categories);
console.log(data.phases);

// Or, you can use the `Promise` API.
loadProjectFormOptions().then((response) => {
  const data = response.data;
  console.log(data.categories);
  console.log(data.phases);
});
```

### Using `LoadProjectFormOptions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, loadProjectFormOptionsRef } from '@dataconnect/generated';


// Call the `loadProjectFormOptionsRef()` function to get a reference to the query.
const ref = loadProjectFormOptionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = loadProjectFormOptionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.categories);
console.log(data.phases);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.categories);
  console.log(data.phases);
});
```

## GetMyProfile
You can execute the `GetMyProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyProfileRef:
```typescript
const name = getMyProfileRef.operationName;
console.log(name);
```

### Variables
The `GetMyProfile` query has no variables.
### Return Type
Recall that executing the `GetMyProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyProfile } from '@dataconnect/generated';


// Call the `getMyProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyProfile(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMyProfile().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMyProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyProfileRef } from '@dataconnect/generated';


// Call the `getMyProfileRef()` function to get a reference to the query.
const ref = getMyProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListMyProjects
You can execute the `ListMyProjects` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyProjects(options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, undefined>;

interface ListMyProjectsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyProjectsData, undefined>;
}
export const listMyProjectsRef: ListMyProjectsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyProjects(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, undefined>;

interface ListMyProjectsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyProjectsData, undefined>;
}
export const listMyProjectsRef: ListMyProjectsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyProjectsRef:
```typescript
const name = listMyProjectsRef.operationName;
console.log(name);
```

### Variables
The `ListMyProjects` query has no variables.
### Return Type
Recall that executing the `ListMyProjects` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyProjectsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyProjects`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyProjects } from '@dataconnect/generated';


// Call the `listMyProjects()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyProjects();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyProjects(dataConnect);

console.log(data.projects);

// Or, you can use the `Promise` API.
listMyProjects().then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

### Using `ListMyProjects`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyProjectsRef } from '@dataconnect/generated';


// Call the `listMyProjectsRef()` function to get a reference to the query.
const ref = listMyProjectsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyProjectsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.projects);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

## ListMyAuditLogs
You can execute the `ListMyAuditLogs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyAuditLogs(options?: ExecuteQueryOptions): QueryPromise<ListMyAuditLogsData, undefined>;

interface ListMyAuditLogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyAuditLogsData, undefined>;
}
export const listMyAuditLogsRef: ListMyAuditLogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyAuditLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyAuditLogsData, undefined>;

interface ListMyAuditLogsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyAuditLogsData, undefined>;
}
export const listMyAuditLogsRef: ListMyAuditLogsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyAuditLogsRef:
```typescript
const name = listMyAuditLogsRef.operationName;
console.log(name);
```

### Variables
The `ListMyAuditLogs` query has no variables.
### Return Type
Recall that executing the `ListMyAuditLogs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyAuditLogsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyAuditLogs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyAuditLogs } from '@dataconnect/generated';


// Call the `listMyAuditLogs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyAuditLogs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyAuditLogs(dataConnect);

console.log(data.auditLogs);

// Or, you can use the `Promise` API.
listMyAuditLogs().then((response) => {
  const data = response.data;
  console.log(data.auditLogs);
});
```

### Using `ListMyAuditLogs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyAuditLogsRef } from '@dataconnect/generated';


// Call the `listMyAuditLogsRef()` function to get a reference to the query.
const ref = listMyAuditLogsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyAuditLogsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.auditLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.auditLogs);
});
```

## AdminListProjects
You can execute the `AdminListProjects` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminListProjects(options?: ExecuteQueryOptions): QueryPromise<AdminListProjectsData, undefined>;

interface AdminListProjectsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListProjectsData, undefined>;
}
export const adminListProjectsRef: AdminListProjectsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListProjects(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListProjectsData, undefined>;

interface AdminListProjectsRef {
  ...
  (dc: DataConnect): QueryRef<AdminListProjectsData, undefined>;
}
export const adminListProjectsRef: AdminListProjectsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListProjectsRef:
```typescript
const name = adminListProjectsRef.operationName;
console.log(name);
```

### Variables
The `AdminListProjects` query has no variables.
### Return Type
Recall that executing the `AdminListProjects` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListProjectsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AdminListProjects`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListProjects } from '@dataconnect/generated';


// Call the `adminListProjects()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListProjects();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListProjects(dataConnect);

console.log(data.projects);

// Or, you can use the `Promise` API.
adminListProjects().then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

### Using `AdminListProjects`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListProjectsRef } from '@dataconnect/generated';


// Call the `adminListProjectsRef()` function to get a reference to the query.
const ref = adminListProjectsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListProjectsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.projects);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertMyProfile
You can execute the `UpsertMyProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertMyProfile(vars: UpsertMyProfileVariables): MutationPromise<UpsertMyProfileData, UpsertMyProfileVariables>;

interface UpsertMyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMyProfileVariables): MutationRef<UpsertMyProfileData, UpsertMyProfileVariables>;
}
export const upsertMyProfileRef: UpsertMyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertMyProfile(dc: DataConnect, vars: UpsertMyProfileVariables): MutationPromise<UpsertMyProfileData, UpsertMyProfileVariables>;

interface UpsertMyProfileRef {
  ...
  (dc: DataConnect, vars: UpsertMyProfileVariables): MutationRef<UpsertMyProfileData, UpsertMyProfileVariables>;
}
export const upsertMyProfileRef: UpsertMyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertMyProfileRef:
```typescript
const name = upsertMyProfileRef.operationName;
console.log(name);
```

### Variables
The `UpsertMyProfile` mutation requires an argument of type `UpsertMyProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertMyProfileVariables {
  username: string;
}
```
### Return Type
Recall that executing the `UpsertMyProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertMyProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertMyProfileData {
  user_upsert: User_Key;
}
```
### Using `UpsertMyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertMyProfile, UpsertMyProfileVariables } from '@dataconnect/generated';

// The `UpsertMyProfile` mutation requires an argument of type `UpsertMyProfileVariables`:
const upsertMyProfileVars: UpsertMyProfileVariables = {
  username: ..., 
};

// Call the `upsertMyProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertMyProfile(upsertMyProfileVars);
// Variables can be defined inline as well.
const { data } = await upsertMyProfile({ username: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertMyProfile(dataConnect, upsertMyProfileVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertMyProfile(upsertMyProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertMyProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertMyProfileRef, UpsertMyProfileVariables } from '@dataconnect/generated';

// The `UpsertMyProfile` mutation requires an argument of type `UpsertMyProfileVariables`:
const upsertMyProfileVars: UpsertMyProfileVariables = {
  username: ..., 
};

// Call the `upsertMyProfileRef()` function to get a reference to the mutation.
const ref = upsertMyProfileRef(upsertMyProfileVars);
// Variables can be defined inline as well.
const ref = upsertMyProfileRef({ username: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertMyProfileRef(dataConnect, upsertMyProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateProject
You can execute the `CreateProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createProject(vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface CreateProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
}
export const createProjectRef: CreateProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProject(dc: DataConnect, vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface CreateProjectRef {
  ...
  (dc: DataConnect, vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
}
export const createProjectRef: CreateProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProjectRef:
```typescript
const name = createProjectRef.operationName;
console.log(name);
```

### Variables
The `CreateProject` mutation requires an argument of type `CreateProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProjectVariables {
  name: string;
  description: string;
  features?: string | null;
  categoryId: UUIDString;
  phaseId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProjectData {
  project_insert: Project_Key;
}
```
### Using `CreateProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProject, CreateProjectVariables } from '@dataconnect/generated';

// The `CreateProject` mutation requires an argument of type `CreateProjectVariables`:
const createProjectVars: CreateProjectVariables = {
  name: ..., 
  description: ..., 
  features: ..., // optional
  categoryId: ..., 
  phaseId: ..., 
};

// Call the `createProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProject(createProjectVars);
// Variables can be defined inline as well.
const { data } = await createProject({ name: ..., description: ..., features: ..., categoryId: ..., phaseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProject(dataConnect, createProjectVars);

console.log(data.project_insert);

// Or, you can use the `Promise` API.
createProject(createProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_insert);
});
```

### Using `CreateProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProjectRef, CreateProjectVariables } from '@dataconnect/generated';

// The `CreateProject` mutation requires an argument of type `CreateProjectVariables`:
const createProjectVars: CreateProjectVariables = {
  name: ..., 
  description: ..., 
  features: ..., // optional
  categoryId: ..., 
  phaseId: ..., 
};

// Call the `createProjectRef()` function to get a reference to the mutation.
const ref = createProjectRef(createProjectVars);
// Variables can be defined inline as well.
const ref = createProjectRef({ name: ..., description: ..., features: ..., categoryId: ..., phaseId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProjectRef(dataConnect, createProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_insert);
});
```

## UpdateMyProject
You can execute the `UpdateMyProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMyProject(vars: UpdateMyProjectVariables): MutationPromise<UpdateMyProjectData, UpdateMyProjectVariables>;

interface UpdateMyProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMyProjectVariables): MutationRef<UpdateMyProjectData, UpdateMyProjectVariables>;
}
export const updateMyProjectRef: UpdateMyProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMyProject(dc: DataConnect, vars: UpdateMyProjectVariables): MutationPromise<UpdateMyProjectData, UpdateMyProjectVariables>;

interface UpdateMyProjectRef {
  ...
  (dc: DataConnect, vars: UpdateMyProjectVariables): MutationRef<UpdateMyProjectData, UpdateMyProjectVariables>;
}
export const updateMyProjectRef: UpdateMyProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMyProjectRef:
```typescript
const name = updateMyProjectRef.operationName;
console.log(name);
```

### Variables
The `UpdateMyProject` mutation requires an argument of type `UpdateMyProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMyProjectVariables {
  id: UUIDString;
  name: string;
  description: string;
  features?: string | null;
  categoryId: UUIDString;
}
```
### Return Type
Recall that executing the `UpdateMyProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMyProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMyProjectData {
  project_update?: Project_Key | null;
}
```
### Using `UpdateMyProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMyProject, UpdateMyProjectVariables } from '@dataconnect/generated';

// The `UpdateMyProject` mutation requires an argument of type `UpdateMyProjectVariables`:
const updateMyProjectVars: UpdateMyProjectVariables = {
  id: ..., 
  name: ..., 
  description: ..., 
  features: ..., // optional
  categoryId: ..., 
};

// Call the `updateMyProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMyProject(updateMyProjectVars);
// Variables can be defined inline as well.
const { data } = await updateMyProject({ id: ..., name: ..., description: ..., features: ..., categoryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMyProject(dataConnect, updateMyProjectVars);

console.log(data.project_update);

// Or, you can use the `Promise` API.
updateMyProject(updateMyProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

### Using `UpdateMyProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMyProjectRef, UpdateMyProjectVariables } from '@dataconnect/generated';

// The `UpdateMyProject` mutation requires an argument of type `UpdateMyProjectVariables`:
const updateMyProjectVars: UpdateMyProjectVariables = {
  id: ..., 
  name: ..., 
  description: ..., 
  features: ..., // optional
  categoryId: ..., 
};

// Call the `updateMyProjectRef()` function to get a reference to the mutation.
const ref = updateMyProjectRef(updateMyProjectVars);
// Variables can be defined inline as well.
const ref = updateMyProjectRef({ id: ..., name: ..., description: ..., features: ..., categoryId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMyProjectRef(dataConnect, updateMyProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

## AdminUpdateProjectPhase
You can execute the `AdminUpdateProjectPhase` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminUpdateProjectPhase(vars: AdminUpdateProjectPhaseVariables): MutationPromise<AdminUpdateProjectPhaseData, AdminUpdateProjectPhaseVariables>;

interface AdminUpdateProjectPhaseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateProjectPhaseVariables): MutationRef<AdminUpdateProjectPhaseData, AdminUpdateProjectPhaseVariables>;
}
export const adminUpdateProjectPhaseRef: AdminUpdateProjectPhaseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminUpdateProjectPhase(dc: DataConnect, vars: AdminUpdateProjectPhaseVariables): MutationPromise<AdminUpdateProjectPhaseData, AdminUpdateProjectPhaseVariables>;

interface AdminUpdateProjectPhaseRef {
  ...
  (dc: DataConnect, vars: AdminUpdateProjectPhaseVariables): MutationRef<AdminUpdateProjectPhaseData, AdminUpdateProjectPhaseVariables>;
}
export const adminUpdateProjectPhaseRef: AdminUpdateProjectPhaseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminUpdateProjectPhaseRef:
```typescript
const name = adminUpdateProjectPhaseRef.operationName;
console.log(name);
```

### Variables
The `AdminUpdateProjectPhase` mutation requires an argument of type `AdminUpdateProjectPhaseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminUpdateProjectPhaseVariables {
  id: UUIDString;
  phaseId: UUIDString;
  progressPercent: number;
}
```
### Return Type
Recall that executing the `AdminUpdateProjectPhase` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminUpdateProjectPhaseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminUpdateProjectPhaseData {
  project_update?: Project_Key | null;
}
```
### Using `AdminUpdateProjectPhase`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminUpdateProjectPhase, AdminUpdateProjectPhaseVariables } from '@dataconnect/generated';

// The `AdminUpdateProjectPhase` mutation requires an argument of type `AdminUpdateProjectPhaseVariables`:
const adminUpdateProjectPhaseVars: AdminUpdateProjectPhaseVariables = {
  id: ..., 
  phaseId: ..., 
  progressPercent: ..., 
};

// Call the `adminUpdateProjectPhase()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminUpdateProjectPhase(adminUpdateProjectPhaseVars);
// Variables can be defined inline as well.
const { data } = await adminUpdateProjectPhase({ id: ..., phaseId: ..., progressPercent: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminUpdateProjectPhase(dataConnect, adminUpdateProjectPhaseVars);

console.log(data.project_update);

// Or, you can use the `Promise` API.
adminUpdateProjectPhase(adminUpdateProjectPhaseVars).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

### Using `AdminUpdateProjectPhase`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminUpdateProjectPhaseRef, AdminUpdateProjectPhaseVariables } from '@dataconnect/generated';

// The `AdminUpdateProjectPhase` mutation requires an argument of type `AdminUpdateProjectPhaseVariables`:
const adminUpdateProjectPhaseVars: AdminUpdateProjectPhaseVariables = {
  id: ..., 
  phaseId: ..., 
  progressPercent: ..., 
};

// Call the `adminUpdateProjectPhaseRef()` function to get a reference to the mutation.
const ref = adminUpdateProjectPhaseRef(adminUpdateProjectPhaseVars);
// Variables can be defined inline as well.
const ref = adminUpdateProjectPhaseRef({ id: ..., phaseId: ..., progressPercent: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminUpdateProjectPhaseRef(dataConnect, adminUpdateProjectPhaseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

## AdminSetProjectApproval
You can execute the `AdminSetProjectApproval` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminSetProjectApproval(vars: AdminSetProjectApprovalVariables): MutationPromise<AdminSetProjectApprovalData, AdminSetProjectApprovalVariables>;

interface AdminSetProjectApprovalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminSetProjectApprovalVariables): MutationRef<AdminSetProjectApprovalData, AdminSetProjectApprovalVariables>;
}
export const adminSetProjectApprovalRef: AdminSetProjectApprovalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminSetProjectApproval(dc: DataConnect, vars: AdminSetProjectApprovalVariables): MutationPromise<AdminSetProjectApprovalData, AdminSetProjectApprovalVariables>;

interface AdminSetProjectApprovalRef {
  ...
  (dc: DataConnect, vars: AdminSetProjectApprovalVariables): MutationRef<AdminSetProjectApprovalData, AdminSetProjectApprovalVariables>;
}
export const adminSetProjectApprovalRef: AdminSetProjectApprovalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminSetProjectApprovalRef:
```typescript
const name = adminSetProjectApprovalRef.operationName;
console.log(name);
```

### Variables
The `AdminSetProjectApproval` mutation requires an argument of type `AdminSetProjectApprovalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminSetProjectApprovalVariables {
  id: UUIDString;
  approvalStatus: ProjectApprovalStatus;
}
```
### Return Type
Recall that executing the `AdminSetProjectApproval` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminSetProjectApprovalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminSetProjectApprovalData {
  project_update?: Project_Key | null;
}
```
### Using `AdminSetProjectApproval`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminSetProjectApproval, AdminSetProjectApprovalVariables } from '@dataconnect/generated';

// The `AdminSetProjectApproval` mutation requires an argument of type `AdminSetProjectApprovalVariables`:
const adminSetProjectApprovalVars: AdminSetProjectApprovalVariables = {
  id: ..., 
  approvalStatus: ..., 
};

// Call the `adminSetProjectApproval()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminSetProjectApproval(adminSetProjectApprovalVars);
// Variables can be defined inline as well.
const { data } = await adminSetProjectApproval({ id: ..., approvalStatus: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminSetProjectApproval(dataConnect, adminSetProjectApprovalVars);

console.log(data.project_update);

// Or, you can use the `Promise` API.
adminSetProjectApproval(adminSetProjectApprovalVars).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

### Using `AdminSetProjectApproval`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminSetProjectApprovalRef, AdminSetProjectApprovalVariables } from '@dataconnect/generated';

// The `AdminSetProjectApproval` mutation requires an argument of type `AdminSetProjectApprovalVariables`:
const adminSetProjectApprovalVars: AdminSetProjectApprovalVariables = {
  id: ..., 
  approvalStatus: ..., 
};

// Call the `adminSetProjectApprovalRef()` function to get a reference to the mutation.
const ref = adminSetProjectApprovalRef(adminSetProjectApprovalVars);
// Variables can be defined inline as well.
const ref = adminSetProjectApprovalRef({ id: ..., approvalStatus: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminSetProjectApprovalRef(dataConnect, adminSetProjectApprovalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

## AdminUpdateProject
You can execute the `AdminUpdateProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminUpdateProject(vars: AdminUpdateProjectVariables): MutationPromise<AdminUpdateProjectData, AdminUpdateProjectVariables>;

interface AdminUpdateProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateProjectVariables): MutationRef<AdminUpdateProjectData, AdminUpdateProjectVariables>;
}
export const adminUpdateProjectRef: AdminUpdateProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminUpdateProject(dc: DataConnect, vars: AdminUpdateProjectVariables): MutationPromise<AdminUpdateProjectData, AdminUpdateProjectVariables>;

interface AdminUpdateProjectRef {
  ...
  (dc: DataConnect, vars: AdminUpdateProjectVariables): MutationRef<AdminUpdateProjectData, AdminUpdateProjectVariables>;
}
export const adminUpdateProjectRef: AdminUpdateProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminUpdateProjectRef:
```typescript
const name = adminUpdateProjectRef.operationName;
console.log(name);
```

### Variables
The `AdminUpdateProject` mutation requires an argument of type `AdminUpdateProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminUpdateProjectVariables {
  id: UUIDString;
  name: string;
  description: string;
  features?: string | null;
  categoryId: UUIDString;
}
```
### Return Type
Recall that executing the `AdminUpdateProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminUpdateProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminUpdateProjectData {
  project_update?: Project_Key | null;
}
```
### Using `AdminUpdateProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminUpdateProject, AdminUpdateProjectVariables } from '@dataconnect/generated';

// The `AdminUpdateProject` mutation requires an argument of type `AdminUpdateProjectVariables`:
const adminUpdateProjectVars: AdminUpdateProjectVariables = {
  id: ..., 
  name: ..., 
  description: ..., 
  features: ..., // optional
  categoryId: ..., 
};

// Call the `adminUpdateProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminUpdateProject(adminUpdateProjectVars);
// Variables can be defined inline as well.
const { data } = await adminUpdateProject({ id: ..., name: ..., description: ..., features: ..., categoryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminUpdateProject(dataConnect, adminUpdateProjectVars);

console.log(data.project_update);

// Or, you can use the `Promise` API.
adminUpdateProject(adminUpdateProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

### Using `AdminUpdateProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminUpdateProjectRef, AdminUpdateProjectVariables } from '@dataconnect/generated';

// The `AdminUpdateProject` mutation requires an argument of type `AdminUpdateProjectVariables`:
const adminUpdateProjectVars: AdminUpdateProjectVariables = {
  id: ..., 
  name: ..., 
  description: ..., 
  features: ..., // optional
  categoryId: ..., 
};

// Call the `adminUpdateProjectRef()` function to get a reference to the mutation.
const ref = adminUpdateProjectRef(adminUpdateProjectVars);
// Variables can be defined inline as well.
const ref = adminUpdateProjectRef({ id: ..., name: ..., description: ..., features: ..., categoryId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminUpdateProjectRef(dataConnect, adminUpdateProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

