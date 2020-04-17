pragma solidity >=0.4.22 <0.7.0;

interface IGroup{

  function getGroupName() external view virtual returns(bytes32);

  function getPosition() external view virtual returns(uint);

  function updatePosition(uint _pos) external virtual;

  function sendEventMessage(bytes32 _message, bool encrypted) external virtual;
  
  function sendCostlyMessage(bytes32 _message) external virtual;

  function sendDonation(bytes32 _username) external payable virtual;

  function closeGroup() external virtual;
  
}

