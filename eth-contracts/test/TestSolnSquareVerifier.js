var Verifier = artifacts.require('Verifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var proof39 = require('../../zokrates/code/square/proof39.json');
var proof24 = require('../../zokrates/code/square/proof24.json');

contract('Verifier', accounts => {
    const owner = accounts[0];
    const acc_1 = accounts[1];

    describe('testing Verifier + ERC721 integration works', function () {
        before(async function () { 
            this.verifierContract = await Verifier.new();
            this.solnSquareVerifierContract = await SolnSquareVerifier.new(this.verifierContract.address, 'Real Estate Title Token', 'RETT');
        });

        it('should have set name', async function () { 
            let name = await this.solnSquareVerifierContract.name.call();
            console.log(name);
            assert.equal(name, 'Real Estate Title Token', "returned name is wrong")
        })

        it('should have set symbol', async function () { 
            let symbol = await this.solnSquareVerifierContract.symbol.call();
            console.log(symbol);
            assert.equal(symbol, 'RETT', "returned symbol is wrong")
        })

        it('token is minted appropriately with 3**2=9 solution', async function () { 
            let mintResult = await this.solnSquareVerifierContract.mint.call(
                proof39['proof']['A'], proof39['proof']['A_p'],
                proof39['proof']['B'], proof39['proof']['B_p'],
                proof39['proof']['C'], proof39['proof']['C_p'],
                proof39['proof']['H'], proof39['proof']['K'], proof39['input']);
            assert.equal(true, mintResult, "not succesfully minted");
        });

        it('token is minted appropriately with 2**2=4 solution', async function () { 
            let mintResult2 = await this.solnSquareVerifierContract.mint.call(
                proof24['proof']['A'], proof24['proof']['A_p'],
                proof24['proof']['B'], proof24['proof']['B_p'],
                proof24['proof']['C'], proof24['proof']['C_p'],
                proof24['proof']['H'], proof24['proof']['K'], proof24['input']);
            assert.equal(true, mintResult2, "not succesfully minted");
        });

        it('SolutionAdded event is emitted', async function () { 
            let mintResult3 = await this.solnSquareVerifierContract.mint(
                proof39['proof']['A'], proof39['proof']['A_p'],
                proof39['proof']['B'], proof39['proof']['B_p'],
                proof39['proof']['C'], proof39['proof']['C_p'],
                proof39['proof']['H'], proof39['proof']['K'], proof39['input']);
            assert.equal(mintResult3.logs[0]['event'], 'SolutionAdded', "SolutionAdded event not emitted");
        });

        it('token minted appropriately', async function () { 
            let mintedOwner = await this.solnSquareVerifierContract.ownerOf.call(1);
            assert.equal(mintedOwner, owner, "token not minted by owner")
        })

        it('token cannot be minted twice with the same solution', async function () { 
            let accessDenied = false;
            try { 
                await this.solnSquareVerifierContract.mint(
                proof39['proof']['A'], proof39['proof']['A_p'],
                proof39['proof']['B'], proof39['proof']['B_p'],
                proof39['proof']['C'], proof39['proof']['C_p'],
                proof39['proof']['H'], proof39['proof']['K'], proof39['input']);
                }
            catch(e) { accessDenied = true; }
            assert.equal(accessDenied, true, "unique solution logic not working");
        });

        it('SolutionAdded event emitted with 2**2=4 solution', async function () { 
            let mintResult4 = await this.solnSquareVerifierContract.mint(
                proof24['proof']['A'], proof24['proof']['A_p'],
                proof24['proof']['B'], proof24['proof']['B_p'],
                proof24['proof']['C'], proof24['proof']['C_p'],
                proof24['proof']['H'], proof24['proof']['K'], proof24['input']);
            assert.equal(mintResult4.logs[0]['event'], 'SolutionAdded', "SolutionAdded event not emitted");
        });

        it('token minted appropriately', async function () { 
            let mintedOwner2 = await this.solnSquareVerifierContract.ownerOf.call(2);
            assert.equal(mintedOwner2, owner, "token not minted by owner")
        })

        it('solution is stored in mapping', async function () { 
            let enc = web3.eth.abi.encodeParameters(
                ['uint256[2]', 'uint256[2]',
                'uint256[2][2]', 'uint256[2]',
                'uint256[2]', 'uint256[2]',
                'uint256[2]', 'uint256[2]', 'uint256[2]'],
                [proof39['proof']['A'], proof39['proof']['A_p'],
                proof39['proof']['B'], proof39['proof']['B_p'],
                proof39['proof']['C'], proof39['proof']['C_p'],
                proof39['proof']['H'], proof39['proof']['K'], proof39['input']]);
            let solHash = web3.utils.soliditySha3(enc);

            let solution = await this.solnSquareVerifierContract.solution.call(solHash);
            console.log(solution[0].toNumber());
            assert.equal(solution[0].toNumber() == 1, true,  "solution was saved")
        });

        it('second solution is stored in mapping', async function () { 
            let enc = web3.eth.abi.encodeParameters(
                ['uint256[2]', 'uint256[2]',
                'uint256[2][2]', 'uint256[2]',
                'uint256[2]', 'uint256[2]',
                'uint256[2]', 'uint256[2]', 'uint256[2]'],
                [proof24['proof']['A'], proof24['proof']['A_p'],
                proof24['proof']['B'], proof24['proof']['B_p'],
                proof24['proof']['C'], proof24['proof']['C_p'],
                proof24['proof']['H'], proof24['proof']['K'], proof24['input']]);
            let solHash = web3.utils.soliditySha3(enc);

            let solution = await this.solnSquareVerifierContract.solution.call(solHash);
            console.log(solution[0].toNumber());
            assert.equal(solution[0].toNumber() == 2, true,  "solution was saved")
        });

    })

})

// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier