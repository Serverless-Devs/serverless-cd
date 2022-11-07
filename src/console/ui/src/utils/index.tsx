import _ from "lodash";

export function getParams(search = '') {
  let obj = {};
  let arr = search.slice(1).split('&');
  arr.forEach((item) => {
    let newArr = item.split('=');
    obj[newArr[0]] = newArr[1];
  });
  return obj;
}

export const sleep = (time = 1000) => new Promise((resolve) => setTimeout(resolve, time));


/**
 * 解析部署分支字段 （ref）
 * refs/tags/xxx
 * @param {string} ref
 */
export const formatTag = (ref) => {
  const matchRef = ref.match(/refs\/tags\/(.+)/);
  if (matchRef) {
    return matchRef[1];
  }
  return ref
}


/**
 * 解析部署分支字段 （ref）
 * refs/heads/${item.branch}
 * body.ref in ["refs/heads/${item.branch}"]
 * @param {string} ref
 */
export const formatBranch = (ref) => {
  const matchBodyRef = ref.match(/body\.ref in \[\"refs\/heads\/(.+)\"\]/);
  if (matchBodyRef) {
    return matchBodyRef[1];
  }

  const matchRef = ref.match(/refs\/heads\/(.+)/);
  if (matchRef) {
    return matchRef[1];
  }

  return ref;
}
