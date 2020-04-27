import request from '../utils/request';
// 模拟用户信息
export const fetchData = query => {
    return request({
        url: './user.json',
        method: 'get',
        params: query
    });
};
// 模拟机构信息
export const fetchBankData = query => {
    return request({
        url: './bank.json',
        method: 'get',
        params: query
    });
};
// 模拟机构树
export const getBankTree = () => {
    return request({
        url: './bankTree.json',
        method: 'get'
    });
};
// 模拟权限信息
export const fetchRoleData = query => {
    return request({
        url: './role.json',
        method: 'get',
        params: query
    });
};
// 模拟权限列表
export const getAuthorityList = query => {
    return request({
        url: './auth.json',
        method: 'get'
    });
};

// 模拟日志查询
export const fetchLogData = query => {
    return request({
        url: './log.json',
        method: 'get',
        params: query
    });
};