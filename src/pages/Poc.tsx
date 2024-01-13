import { useWeb3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ethers } from "ethers";
import { goerli, avalancheFuji } from "wagmi/chains";
import ctABI from "./ctABI.json";

const university = "0x29dbe8f7F5E9771182aC3f7e451EC0D43EE4cCd8";
const HEC = "0x942F211B5976d90d0FC4e3aa07f89CF466438F63";

function Poc() {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const [requests, setRequests] = useState([]);
  const [record, setRecord] = useState<any>();

  function connectWallet() {
    open();
  }

  let _window = window as any;
  const provider = new ethers.providers.Web3Provider(_window.ethereum);

  useEffect(() => {
    (async () => {
      if (!isConnected) return;

      if (chain?.id != 5) {
        switchNetwork?.(5);
        return;
      }

      const ct = new ethers.Contract(
        "0x04b736fF75eB8A9EBCe0f07460515E7D4f77aabF",
        ctABI,
        provider
      );

      let r = await ct.getRequests();
      console.log(r);

      setRequests(r);
    })();
  }, []);

  const addRecord = async () => {
    const signer = provider.getSigner();
    const ct = new ethers.Contract(
      "0x04b736fF75eB8A9EBCe0f07460515E7D4f77aabF",
      ctABI,
      signer
    );

    let tx = await ct.addRecord(
      (document.getElementById("Student Name") as HTMLInputElement)?.value,
      (document.getElementById("Student Id") as HTMLInputElement)?.value,
      (document.getElementById("Document Type") as HTMLInputElement)?.value,
      (document.getElementById("Issue Date") as HTMLInputElement)?.value,
      (document.getElementById("Hash") as HTMLInputElement)?.value
    );
    let res = await tx.wait();
    console.log(res);
  };

  const approve = async (thirdParty: any, studentId: any) => {
    const signer = provider.getSigner();
    const ct = new ethers.Contract(
      "0x04b736fF75eB8A9EBCe0f07460515E7D4f77aabF",
      ctABI,
      signer
    );

    let tx = await ct.approveRequest(thirdParty, studentId);
    let res = await tx.wait();
    console.log(res);
  };

  const getRecord = async () => {
    const signer = provider.getSigner();
    const ct = new ethers.Contract(
      "0x04b736fF75eB8A9EBCe0f07460515E7D4f77aabF",
      ctABI,
      signer
    );

    try {
      let tx = await ct.getRecord(
        (document.getElementById("recordId") as HTMLInputElement)?.value
      );
      console.log(tx);
      setRecord(tx);
    } catch (e: any) {
      alert("Unauthorized or Invalid Student Id");
      setRecord({});
    }
  };

  return (
    <>
      {address}
      {!isConnected && (
        <button onClick={connectWallet}>Login with Metamask</button>
      )}
      {address == university && (
        <>
          <h4>University: Add Record</h4>
          <div>
            <label>
              Student Name:
              <input id="Student Name" />
            </label>
            <br />
            <label>
              Student Id:
              <input id="Student Id" />
            </label>
            <br />
            <label>
              Document Type:
              <input id="Document Type" />
            </label>
            <br />
            <label>
              Issue Date:
              <input id="Issue Date" />
            </label>
            <br />
            <label>
              Hash:
              <input id="Hash" />
            </label>
            <br />
            <button onClick={addRecord}>Submit</button>
          </div>
        </>
      )}
      {address == HEC && (
        <>
          <h4>HEC: Requests</h4>
          <div>
            {requests.map((r: any) => {
              return (
                <>
                  Student Id: {Number(r.studentId)} Third Party: {r.thirdParty}{" "}
                  <button onClick={() => approve(r.thirdParty, r.studentId)}>
                    Approve Request
                  </button>
                  <br />
                  <br />
                </>
              );
            })}
          </div>
        </>
      )}
      {address && (
        <>
          <h4>Third Party: View Records</h4>
          <div>
            <label>
              Student Id:
              <input id="recordId" />
            </label>
            <button onClick={getRecord}>Submit</button>
          </div>
          <br />
          <div>
            {record && (
              <>
                Student Name: {record.studentName}
                <br />
                Student Id: {Number(record.studentId)}
                <br />
                Document Type: {record.documentType}
                <br />
                Issue Date: {Number(record.issueDate)}
                <br />
                Hash: {record.hash}
                <br />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Poc;
