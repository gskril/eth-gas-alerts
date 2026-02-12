export interface ContractFunction {
  name: string;
  gas: number;
}

export interface Action {
  name: string;
  description?: string;
  contractFunctions: ContractFunction[];
}

export interface Protocol {
  name: string;
  link?: string;
  contractAddress?: string;
  actions: Action[];
}

export const protocols: Protocol[] = [
  {
    name: 'Ethereum Basics',
    actions: [
      {
        name: 'Transfer ETH',
        contractFunctions: [{ name: 'transfer', gas: 21000 }],
      },
      {
        name: 'ERC-20 token transfer',
        description: "OpenZeppelin's ERC-20 template",
        contractFunctions: [{ name: 'transfer', gas: 35000 }],
      },
      {
        name: 'ERC-721 NFT transfer',
        description: "OpenZeppelin's ERC-721 template",
        contractFunctions: [{ name: 'safeTransferFrom', gas: 46000 }],
      },
      {
        name: 'ERC-1155 NFT transfer',
        description: "OpenZeppelin's ERC-1155 template",
        contractFunctions: [{ name: 'safeTransferFrom', gas: 54000 }],
      },
    ],
  },
  {
    name: 'Ethereum Name Service',
    link: 'https://ens.domains',
    actions: [
      {
        name: 'Register and set primary name',
        description: '8 char name, just set ETH address, no additional records',
        contractFunctions: [
          { name: 'commit', gas: 46500 },
          { name: 'register', gas: 280000 },
        ],
      },
      {
        name: 'Register .eth name',
        description: '8 char name, just set ETH address, no additional records',
        contractFunctions: [
          { name: 'commit', gas: 46500 },
          { name: 'register', gas: 232100 },
        ],
      },
      {
        name: 'Set primary name',
        description: '8 char name',
        contractFunctions: [{ name: 'setName', gas: 78500 }],
      },
      {
        name: 'Create subdomain',
        description: 'Unwrapped .eth name',
        contractFunctions: [{ name: 'setSubnodeRecord', gas: 76350 }],
      },
      {
        name: 'Import DNS name',
        description: 'Average of last 5 mainnet imports',
        contractFunctions: [{ name: 'proveAndClaimWithResolver', gas: 3371692 }],
      },
      {
        name: 'Set text record',
        description: 'Twitter handle',
        contractFunctions: [{ name: 'setText', gas: 60000 }],
      },
      {
        name: 'Renew name',
        description: '8 char unwrapped name',
        contractFunctions: [{ name: 'renew', gas: 68770 }],
      },
    ],
  },
  // {
  //   name: 'Gnosis Safe',
  //   link: 'https://gnosis-safe.io/',
  //   contractAddress: '0xa6b71e26c5e0845f74c812102ca7114b6a896ab2',
  //   actions: [
  //     {
  //       name: 'Safe creation (4 owners)',
  //       contractFunctions: [{ name: 'createProxyWithNonce', gas: 355556 }],
  //     },
  //     {
  //       name: 'Add owner',
  //       contractFunctions: [{ name: 'addOwnerWithThreshold', gas: 83118 }],
  //     },
  //     {
  //       name: 'Remove owner',
  //       contractFunctions: [{ name: 'removeOwner', gas: 70000 }],
  //     },
  //   ],
  // },
];
