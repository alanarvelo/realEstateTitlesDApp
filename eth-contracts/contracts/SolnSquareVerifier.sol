pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./Verifier.sol";
import '../../node_modules/openzeppelin-solidity/contracts/drafts/Counters.sol';


// // TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

// // TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is ERC721Mintable {
    using Counters for Counters.Counter;

    Verifier verifierContract;
    struct Solution {
        uint256 tokenId;
        address submitter;
    }
    Counters.Counter counter;
    mapping(bytes32 => Solution) solutions;

    event SolutionAdded(uint256 indexed index, address indexed user);

    constructor(address verifierAddress, string memory name, string memory symbol)
    ERC721Mintable(name, symbol) public {
        verifierContract = Verifier(verifierAddress);
    }

    function addSolution(bytes32 solHash, address submitter) internal {
        solutions[solHash].tokenId = counter.current();
        solutions[solHash].submitter = submitter;

        emit SolutionAdded(counter.current(), submitter);
    }

    function solution(bytes32 solHash) public view returns(uint256, address) {
        return (solutions[solHash].tokenId, solutions[solHash].submitter);
    }

    function mint(
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input
        ) public returns(bool) {

        bool verificationResult = verifierContract.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input);
        if (!verificationResult) return false;
        else {
            bytes32 solHash = keccak256(abi.encode(a, a_p, b, b_p, c, c_p, h, k, input));
            require(solutions[solHash].submitter == address(0), "solution is not unique, has been used before");
            counter.increment();
            addSolution(solHash, msg.sender);
            super.mint(msg.sender, counter.current());
            // _addTokenToOwnerEnumeration(msg.sender, counter.current());
            // _addTokenToAllTokensEnumeration(counter.current());
            return true;
        }

    }

}

// // TODO define a solutions struct that can hold an index & an address
// // TODO define an array of the above struct
// // TODO define a mapping to store unique solutions submitted
// // TODO Create an event to emit when a solution is added
// // TODO Create a function to add the solutions to the array and emit the event

// // TODO Create a function to mint new NFT only after the solution has been verified
// //  - make sure the solution is unique (has not been used before)
// //  - make sure you handle metadata as well as tokenSuplly

  


























