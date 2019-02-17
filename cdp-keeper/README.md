# safe cdp-keeper built off cdp-keeper

## Features compared to cdp-keeper

  * Requires a private key to be either stored as a environment variable 'PRIVKEY'
  * Instead of using filters, checks the blockchain every 17 seconds for updates to cups
  * Keepers can choose either specific cupids to track or use the SafeCDPFactory address to find
    specific cups to watch and handle.


## Example

If the CDP collateralization ratio goes below `--min-margin` and at the same time the debt is greater than `--max-sai`, it tries to `wipe` some debt targeting `--avg-sai`. if wiping that debt didn't help to bring collateralization ratio above `--min-margin` (or it wasn't possible to `wipe` at all for some reason, for example the keeper didn't have any Dai), it then tries to `lock` some extra collateral in order to bring collateralization ratio at least to `--top-up-margin`

Both `--min-margin` and `--top-up-margin` are expressed as on top of the current liquidation ratio configured.

## Installation

This project was built using *Python 3.6.7* with a virtualenv.

In order to clone the project and install required third-party packages please execute:
```
git clone https://github.com/derekchiang/safe-cdp.git
cd safe-cdp/cdp-keeper
git submodule update --init --recursive
pip3 install -r requirements.txt
```

For some known Ubuntu and macOS issues see the [pymaker](https://github.com/makerdao/pymaker) README.

## Usage

kovan params:
bin/cdp-keeper --rpc-host https://kovan.infura.io/v3/<INFURA_KEY> --eth-from <trxn_sender> --tub-address 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2 --min-margin 0.3 --max-sai 10 --avg-sai 30 --top-up-margin 0.5
--cdpids '4991'

```
usage: cdp-keeper [-h] [--rpc-host RPC_HOST] [--rpc-port RPC_PORT]
                  [--rpc-timeout RPC_TIMEOUT] --eth-from ETH_FROM
                  --tub-address TUB_ADDRESS --min-margin MIN_MARGIN
                  --top-up-margin TOP_UP_MARGIN --max-sai MAX_SAI --avg-sai
                  AVG_SAI [--gas-price GAS_PRICE] [--debug] [--safefactory] [--cdpids]

optional arguments:
  -h, --help            show this help message and exit
  --rpc-host RPC_HOST   JSON-RPC host (default: `localhost')
  --rpc-port RPC_PORT   JSON-RPC port (default: `8545')
  --rpc-timeout RPC_TIMEOUT
                        JSON-RPC timeout (in seconds, default: 10)
  --eth-from ETH_FROM   Ethereum account from which to send transactions
  --tub-address TUB_ADDRESS
                        Ethereum address of the Tub contract
  --min-margin MIN_MARGIN
                        Margin between the liquidation ratio and the top-up
                        threshold
  --top-up-margin TOP_UP_MARGIN
                        Margin between the liquidation ratio and the top-up
                        target
  --max-sai MAX_SAI
  --avg-sai AVG_SAI
  --gas-price GAS_PRICE
                        Gas price in Wei (default: node default)
  --debug               Enable debug output
  --safefactory SAFEFACTORY
                        SafeCDP address to find safecdps (optional)
  --cdpids CDPIDS       CDP Ids to monitor in a comma seperated string (optional)
```

## License

See [COPYING](https://github.com/makerdao/cdp-keeper/blob/master/COPYING) file.

### Disclaimer

YOU (MEANING ANY INDIVIDUAL OR ENTITY ACCESSING, USING OR BOTH THE SOFTWARE INCLUDED IN THIS GITHUB REPOSITORY) EXPRESSLY UNDERSTAND AND AGREE THAT YOUR USE OF THE SOFTWARE IS AT YOUR SOLE RISK.
THE SOFTWARE IN THIS GITHUB REPOSITORY IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
YOU RELEASE AUTHORS OR COPYRIGHT HOLDERS FROM ALL LIABILITY FOR YOU HAVING ACQUIRED OR NOT ACQUIRED CONTENT IN THIS GITHUB REPOSITORY. THE AUTHORS OR COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS CONCERNING ANY CONTENT CONTAINED IN OR ACCESSED THROUGH THE SERVICE, AND THE AUTHORS OR COPYRIGHT HOLDERS WILL NOT BE RESPONSIBLE OR LIABLE FOR THE ACCURACY, COPYRIGHT COMPLIANCE, LEGALITY OR DECENCY OF MATERIAL CONTAINED IN OR ACCESSED THROUGH THIS GITHUB REPOSITORY.
