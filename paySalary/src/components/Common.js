import React, { Component } from 'react'
import { Card, Col, Row } from 'antd';

class Common extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { payroll } = this.props;
    const updateInfo = (error, result) => {
      if (!error) {
        this.getEmployerInfo();
      }
    }

    this.addFund = payroll.AddFund(updateInfo);
    this.getPaid = payroll.GetPaid(updateInfo);
    this.addEmployee = payroll.AddEmployee(updateInfo);
    this.updateEmployee = payroll.UpdateEmployee(updateInfo);
    this.removeEmployee = payroll.RemoveEmployee(updateInfo);

    this.getEmployerInfo();
  }

  componentWillUnmount() {
    this.addFund.stopWatching();
    this.getPaid.stopWatching();
    this.addEmployee.stopWatching();
    this.updateEmployee.stopWatching();
    this.removeEmployee.stopWatching();
  }

  getEmployerInfo = () => {
    const { payroll, account, web3 } = this.props;
    payroll.getEmployerInfo.call({
      from: account,
    }).then((result) => {
      console.log(result); //返回通用信息列表的内容
      this.setState({
        balance: web3.fromWei(result[0].toNumber()),
        runway: result[1].toNumber(),
        employeeCount: result[2].toNumber()
      })
    });
  }

  render() {
    const { runway, balance, employeeCount } = this.state;
    return (
      <div>
        <h2>合约概况</h2>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="借款总金额">{balance} Ether</Card>
          </Col>
          <Col span={8}>
            <Card title="借款人数">{employeeCount}</Card>
          </Col>
          <Col span={8}>
            <Card title="可出资次数">{runway}</Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Common