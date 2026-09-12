# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertMyProfile, createProject, updateMyProject, adminUpdateProjectPhase, adminSetProjectApproval, adminUpdateProject, loadProjectFormOptions, getMyProfile, listMyProjects, listMyAuditLogs } from '@dataconnect/generated';


// Operation UpsertMyProfile:  For variables, look at type UpsertMyProfileVars in ../index.d.ts
const { data } = await UpsertMyProfile(dataConnect, upsertMyProfileVars);

// Operation CreateProject:  For variables, look at type CreateProjectVars in ../index.d.ts
const { data } = await CreateProject(dataConnect, createProjectVars);

// Operation UpdateMyProject:  For variables, look at type UpdateMyProjectVars in ../index.d.ts
const { data } = await UpdateMyProject(dataConnect, updateMyProjectVars);

// Operation AdminUpdateProjectPhase:  For variables, look at type AdminUpdateProjectPhaseVars in ../index.d.ts
const { data } = await AdminUpdateProjectPhase(dataConnect, adminUpdateProjectPhaseVars);

// Operation AdminSetProjectApproval:  For variables, look at type AdminSetProjectApprovalVars in ../index.d.ts
const { data } = await AdminSetProjectApproval(dataConnect, adminSetProjectApprovalVars);

// Operation AdminUpdateProject:  For variables, look at type AdminUpdateProjectVars in ../index.d.ts
const { data } = await AdminUpdateProject(dataConnect, adminUpdateProjectVars);

// Operation LoadProjectFormOptions: 
const { data } = await LoadProjectFormOptions(dataConnect);

// Operation GetMyProfile: 
const { data } = await GetMyProfile(dataConnect);

// Operation ListMyProjects: 
const { data } = await ListMyProjects(dataConnect);

// Operation ListMyAuditLogs: 
const { data } = await ListMyAuditLogs(dataConnect);


```