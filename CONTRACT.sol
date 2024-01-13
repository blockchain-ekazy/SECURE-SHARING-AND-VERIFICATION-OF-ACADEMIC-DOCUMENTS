// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract Contract {
    address public university;
    address public HEC;

    struct Record {
        string studentName;
        uint studentId; //roll number
        string documentType;
        uint issueDate;
        string hash;
    }
    mapping(uint => Record) records;
    mapping (address => mapping(uint => bool)) approvedParty;

    struct AccessRequest {
        address thirdParty;
        uint studentId;
        bool approved;
    }
    AccessRequest[] public accessRequests;

    constructor (address u_, address hec_) {
        university = u_;
        HEC = hec_;
    }

    function addRecord(string memory studentName, uint studentId, string memory documentType, uint issueDate, string memory hash) public {
        require(msg.sender == university, "Only university can add a record.");
        records[studentId] = Record(studentName, studentId, documentType, issueDate, hash);
    }

    function requestAccess(uint studentId) public {
        accessRequests.push(AccessRequest(msg.sender, studentId, false));
    }

    function approveRequest(address thirdParty, uint studentId) public {
        require(msg.sender == HEC, "Only HEC can approve a request.");

        for(uint i=0; i<accessRequests.length; i++) {
            if(accessRequests[i].thirdParty == thirdParty && accessRequests[i].studentId == studentId) {
                approvedParty[thirdParty][studentId] = true;
                accessRequests[i].approved = true;
            }
        }
    }

    function getRecord(uint studentId) public view returns(Record memory){
        require(approvedParty[msg.sender][studentId] == true, "Unauthorized");
        return records[studentId];
    }

    function getRequests() public view returns(AccessRequest[] memory){
        return accessRequests;
    }
}