pragma solidity >=0.4.22 <0.7.0;

import "./IGroup.sol";

interface ITimeMachineChat{
    
    function setUsername(bytes32 _username) external virtual;
    
    function getUsername() external view virtual returns(bytes32);
    
    function getAddress(bytes32 _username) external view virtual returns(address);
    
    function getGroups() external view virtual returns(IGroup[] memory);
    
    function createGroup(bytes32 _groupName) external virtual;
    
    function deleteGroup() external virtual;
    
    function sayThanks() external payable virtual;
    
    function closeContract() external virtual;
    
}
