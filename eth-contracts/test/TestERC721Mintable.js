var ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const owner = accounts[0];
    const acc_1 = accounts[1];
    const acc_2 = accounts[2];
    const acc_3 = accounts[3];
    const acc_4 = accounts[4];
    const acc_5 = accounts[5];
    const acc_6 = accounts[6];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new('Real Estate Title Token', 'RETT', {from: owner});

            // TODO: mint multiple tokens
            this.contract.mint(acc_1, 1);
            this.contract.mint(acc_2, 2);
            this.contract.mint(acc_3, 3);
            this.contract.mint(acc_4, 4);
            this.contract.mint(acc_4, 5);
        })

        it('should return total supply', async function () { 
            let tokenCount = await this.contract.totalSupply();
            assert.equal(tokenCount, 5, "total token supply is incorrect");
        })

        it('should get token balance', async function () { 
            let accBalance = await this.contract.balanceOf(acc_4);
            assert.equal(accBalance, 2, "token balance off account is incorrect");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let testURI = await this.contract.tokenURI(5);
            assert.equal(testURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/5", "token URI is incorrect");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(acc_4, acc_1, 5, {from: acc_4});
            let newOwner = await this.contract.ownerOf(5);
            assert.equal(newOwner, acc_1, "ownership transfer failed");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new('Real Estate Title Token', 'RETT', {from: acc_1});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            // Ensure that access is allowed for Contract Owner account
            let accessDenied = false;

            try { await this.contract.mint(acc_6, 6, {from: acc_6}); }
            catch(e) { accessDenied = true; }

            assert.equal(accessDenied, true, "Only Contract Owner can mint");
        })

        it('should return contract owner', async function () { 
            let returnedOwner = await this.contract.owner({from: acc_6});
            assert.equal(returnedOwner, acc_1, "returned owner is incorrect")
        })

        it('should have set name', async function () { 
            let name = await this.contract.name.call({from: acc_6});
            console.log(name);
            assert.equal(name, 'Real Estate Title Token', "returned name is wrong")
        })

    });
})