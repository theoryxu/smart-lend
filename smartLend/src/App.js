import React, { Component } from 'react'
import SmartLendContract from '../build/contracts/SmartLend.json'
import getWeb3 from './utils/getWeb3'

import { Layout,Menu,Spin,Alert } from 'antd';

import Founder from './components/Founder';
import Lender from './components/Lender';


import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import 'antd/dist/antd.css'
import './App.css'

const { Header, Content , Footer } = Layout;

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      mode: 'founder'
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const smartLend = contract(SmartLendContract)
    smartLend.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SmartLend.
    var smartLendInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {

      this.setState({
        account: accounts[0]
      });

      SmartLend.deployed().then((instance) => {

        console.log(instance);
        // for debug 
        window.smartLend = instance
        this.setState({
          smartLend: instance
        })
      })
    })
  }

  SelectTab = ({key})=>{
    this.setState({
        mode: key
    })
  }

  renderContent = () => {
    const { account, smartLend, web3, mode } = this.state;

    if(!smartLend){
      return <Spin tip="Loading..." />;
    }

    switch(mode){
      case 'founder':
        return <Founder account={account} smartLend={smartLend} web3={web3} />
      case 'lender':
        return <Lender account={account} smartLend={smartLend} web3={web3} />
      default:
        return <Alert message="请选择您的身份" type="info" showIcon />
    }
  }


  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo">区块链智能借条</div>
          <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['Founder']}
              style="{{ lineHeight:'64px' }}"
              onSelect={this.onSelectTab}
          >
            <Menu.Item key="founder">出资方</Menu.Item>
            <Menu.Item key="lender">借款方</Menu.Item>
          </Menu>
        </Header>
        <Content style="{{padding: '0 50px' }}">
            <Layout style={{ padding: '24px 0', background: '#fff', minHeight: '600px' }}>
              {this.renderContent()}
            </Layout>
        </Content>
        <Footer style={{textAlign:'center'}}>
          SmartLend @2018 区块链智能借条，解您所忧
        </Footer>
      </Layout>
    );
  }
}

export default App
