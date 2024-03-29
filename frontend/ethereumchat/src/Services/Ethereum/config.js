export const TIME_MACHINE_ADDRESS = "0x6bd3a41b513817069a2a81373ee89d9d9db2ca70";

export const TIME_MACHINE_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "groupAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "groupName",
				"type": "bytes32"
			}
		],
		"name": "GroupDeleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "groupAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "groupName",
				"type": "bytes32"
			}
		],
		"name": "NewGroup",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "username",
				"type": "bytes32"
			}
		],
		"name": "Registered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Thanks",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "closeContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_groupName",
				"type": "bytes32"
			}
		],
		"name": "createGroup",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deleteGroup",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sayThanks",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_username",
				"type": "bytes32"
			}
		],
		"name": "setUsername",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_username",
				"type": "bytes32"
			}
		],
		"name": "getAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGroups",
		"outputs": [
			{
				"internalType": "contract IGroup[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUsername",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const GROUPS_ABI = [
        {
                    "inputs": [
                                    {
                                                        "internalType": "address payable",
                                                        "name": "_admin",
                                                        "type": "address"
                                                    },
                                    {
                                                        "internalType": "bytes32",
                                                        "name": "_groupName",
                                                        "type": "bytes32"
                                                    },
                                    {
                                                        "internalType": "uint256",
                                                        "name": "_pos",
                                                        "type": "uint256"
                                                    }
                                ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
        {
                    "anonymous": false,
                    "inputs": [
                                    {
                                                        "indexed": true,
                                                        "internalType": "bytes32",
                                                        "name": "groupName",
                                                        "type": "bytes32"
                                                    },
                                    {
                                                        "indexed": false,
                                                        "internalType": "bytes32",
                                                        "name": "from",
                                                        "type": "bytes32"
                                                    }
                                ],
                    "name": "Donation",
                    "type": "event"
                },
        {
                    "anonymous": false,
                    "inputs": [
                                    {
                                                        "indexed": true,
                                                        "internalType": "bytes32",
                                                        "name": "groupName",
                                                        "type": "bytes32"
                                                    },
                                    {
                                                        "indexed": false,
                                                        "internalType": "bytes32",
                                                        "name": "from",
                                                        "type": "bytes32"
                                                    },
                                    {
                                                        "indexed": false,
                                                        "internalType": "bytes32",
                                                        "name": "message",
                                                        "type": "bytes32"
                                                    },
                                    {
                                                        "indexed": false,
                                                        "internalType": "bool",
                                                        "name": "encrypted",
                                                        "type": "bool"
                                                    }
                                ],
                    "name": "Message",
                    "type": "event"
                },
        {
                    "inputs": [],
                    "name": "closeGroup",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
        {
                    "inputs": [],
                    "name": "getGroupName",
                    "outputs": [
                                    {
                                                        "internalType": "bytes32",
                                                        "name": "",
                                                        "type": "bytes32"
                                                    }
                                ],
                    "stateMutability": "view",
                    "type": "function"
                },
        {
                    "inputs": [],
                    "name": "getPosition",
                    "outputs": [
                                    {
                                                        "internalType": "uint256",
                                                        "name": "",
                                                        "type": "uint256"
                                                    }
                                ],
                    "stateMutability": "view",
                    "type": "function"
                },
        {
                    "inputs": [
                                    {
                                                        "internalType": "bytes32",
                                                        "name": "_message",
                                                        "type": "bytes32"
                                                    }
                                ],
                    "name": "sendCostlyMessage",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
        {
                    "inputs": [
                                    {
                                                        "internalType": "bytes32",
                                                        "name": "_username",
                                                        "type": "bytes32"
                                                    }
                                ],
                    "name": "sendDonation",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
        {
                    "inputs": [
                                    {
                                                        "internalType": "bytes32",
                                                        "name": "_message",
                                                        "type": "bytes32"
                                                    },
                                    {
                                                        "internalType": "bool",
                                                        "name": "encrypted",
                                                        "type": "bool"
                                                    }
                                ],
                    "name": "sendEventMessage",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
        {
                    "inputs": [
                                    {
                                                        "internalType": "uint256",
                                                        "name": "_pos",
                                                        "type": "uint256"
                                                    }
                                ],
                    "name": "updatePosition",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
];
