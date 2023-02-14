import React from 'react';

export enum C_TYPE {
  // repository
  GITHUB = 'github',
  GITEE = 'gitee',
  CODEUP = 'codeup',
  GIT = 'git',
  GITLAB = 'gitlab',
  SELF_GITLAB = 'self-gitlab',
  //
  DEVS = 'devs',
  GITHUB_ACTION = 'github-action',
}

export const C_REPOSITORY = {
  [C_TYPE.GITHUB]: {
    label: 'Github',
    svg: (height = 24, width = height) => (
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2632"
        width={width}
        height={height}
      >
        <path
          d="M64 512c0 195.2 124.8 361.6 300.8 422.4 22.4 6.4 19.2-9.6 19.2-22.4v-76.8c-134.4 16-140.8-73.6-150.4-89.6-19.2-32-60.8-38.4-48-54.4 32-16 64 3.2 99.2 57.6 25.6 38.4 76.8 32 105.6 25.6 6.4-22.4 19.2-44.8 35.2-60.8-144-22.4-201.6-108.8-201.6-211.2 0-48 16-96 48-131.2-22.4-60.8 0-115.2 3.2-121.6 57.6-6.4 118.4 41.6 124.8 44.8 32-9.6 70.4-12.8 112-12.8 41.6 0 80 6.4 112 12.8 12.8-9.6 67.2-48 121.6-44.8 3.2 6.4 25.6 57.6 6.4 118.4 32 38.4 48 83.2 48 131.2 0 102.4-57.6 188.8-201.6 214.4 22.4 22.4 38.4 54.4 38.4 92.8v112c0 9.6 0 19.2 16 19.2C832 876.8 960 710.4 960 512c0-246.4-201.6-448-448-448S64 265.6 64 512z"
          p-id="2633"
          fill="currentColor"
        ></path>
      </svg>
    ),
    disabled: false,
    url: 'https://github.com/login/oauth/authorize?client_id=86059a1b2bb20d3e5fc3&scope=repo,repo:status,delete_repo',
  },
  [C_TYPE.GITEE]: {
    label: 'Gitee',
    svg: (height = 24, width = height) => (
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="32470"
        width={width}
        height={height}
      >
        <path
          d="M512 1000.12c-268.466 0-488.12-219.654-488.12-488.12S243.533 23.88 512 23.88 1000.12 243.533 1000.12 512 780.467 1000.12 512 1000.12z m247.111-543.034H481.492c-12.203 0-24.406 12.203-24.406 24.406v61.016c0 12.203 12.203 24.406 24.406 24.406h167.792c12.203 0 24.406 12.203 24.406 24.406v12.203c0 39.66-33.558 73.218-73.218 73.218H371.665c-12.203 0-24.406-12.203-24.406-24.406V420.477c0-39.66 33.559-73.218 73.218-73.218h338.634c12.203 0 24.406-12.203 24.406-24.406v-61.015c0-12.203-12.203-24.406-24.406-24.406H420.477c-100.675 0-179.994 82.37-179.994 179.995V756.06c0 12.203 12.203 24.406 24.406 24.406h356.938c88.472 0 161.69-73.218 161.69-161.69V481.492c0-12.203-12.203-24.406-24.406-24.406z"
          fill="#c71d23"
          p-id="32471"
        ></path>
      </svg>
    ),
    disabled: false,
    url: `https://gitee.com/oauth/authorize?client_id=ade27888816a6ee0d451ae34ded436588cebebc320b8c1b8f22bad2d7f29da36&redirect_uri=https://fcnext.console.aliyun.com/connected/gitee&response_type=code`,
  },
  [C_TYPE.SELF_GITLAB]: {
    label: '自建GitLab',
    svg: (height = 24, width = height) => (
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="37132"
        width={width}
        height={height}
      >
        <path
          d="M932.317184 567.76704L885.10464 422.46144l-93.57312-287.997952c-4.8128-14.81728-25.776128-14.81728-30.590976 0L667.36128 422.459392H356.62848L263.051264 134.46144c-4.8128-14.81728-25.776128-14.81728-30.593024 0l-93.57312 287.997952-47.210496 145.309696a32.165888 32.165888 0 0 0 11.68384 35.96288l408.6272 296.890368L920.61696 603.734016c11.272192-8.192 15.990784-22.71232 11.68384-35.964928"
          fill="#FC6D26"
          p-id="37133"
        ></path>
        <path
          d="M512.002048 900.62848l155.365376-478.171136H356.634624z"
          fill="#e24328"
          p-id="37134"
          data-spm-anchor-id="a313x.7781069.0.i25"
        ></path>
        <path
          d="M512.004096 900.62848L356.63872 422.47168H138.901504z"
          fill="#fc6d26"
          p-id="37135"
          data-spm-anchor-id="a313x.7781069.0.i28"
        ></path>
        <path
          d="M138.891264 422.465536l-47.214592 145.309696a32.16384 32.16384 0 0 0 11.685888 35.96288L511.991808 900.62848z"
          fill="#FCA326"
          p-id="37136"
        ></path>
        <path
          d="M138.893312 422.459392h217.737216L263.053312 134.46144c-4.8128-14.819328-25.778176-14.819328-30.590976 0z"
          fill="#E24329"
          p-id="37137"
        ></path>
        <path
          d="M512.002048 900.62848l155.365376-478.154752H885.10464z"
          fill="#fc6d26"
          p-id="37138"
          data-spm-anchor-id="a313x.7781069.0.i27"
        ></path>
        <path
          d="M885.11488 422.465536l47.214592 145.309696a32.16384 32.16384 0 0 1-11.685888 35.96288L512.014336 900.62848z"
          fill="#FCA326"
          p-id="37139"
        ></path>
        <path
          d="M885.096448 422.459392H667.36128l93.577216-287.997952c4.814848-14.819328 25.778176-14.819328 30.590976 0z"
          fill="#E24329"
          p-id="37140"
        ></path>
      </svg>
    ),
    disabled: false,
  },
  [C_TYPE.CODEUP]: {
    label: '云效Codeup',
    svg: (height = 24, width = height) => (
      <img
        style={{ height, width }}
        src="https://img.alicdn.com/imgextra/i1/O1CN01sFFMSN1fK5qMMvG27_!!6000000003987-55-tps-102-102.svg"
      />
    ),
    disabled: false,
    url: 'https://codeup.aliyun.com/oauth/authorize?app_id=ac7e0b3c00a3e58f46f62',
    uninstall: 'https://codeup.aliyun.com/oauth/cancel?app_id=ac7e0b3c00a3e58f46f62',
  },
};
