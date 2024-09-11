import tenantConfig from "../constants/tenantConfig";

const getTenantId = () => {
    const currentHost = window.location.hostname;
    const tenantId = tenantConfig[currentHost] || '';
    // const tenantId = window.prompt('Please enter tenant id:');
    console.log('Current Tenant Id: ', tenantId);
    return tenantId;
};

export { getTenantId };