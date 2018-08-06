import React, {Component} from 'react'
import {Card, Col, Row, Layout, Alert, message, Button} from 'antd';

import Common from './Common';

class Employer extends Component {
    checkEmployee = () => {
        const {payroll, account, web3} = this.props;
        payroll.getEmployeeInfoById.call(account, {
            from: account
        }).then((ret) => {
            //  返回一个借条的详情信息
            console.log(ret);
            const info = {
                address: ret[0],
                creditName: ret[1],
                debitName: ret[2],
                salary: ret[3],
                dueTime: ret[4],
                monthRate: ret[5],
                defaultRate: ret[6],
                defaultRate: ret[7],
                totalToPay:ret[8],
                capitalToPay:ret[9]
                startTime:ret[10]
                lastTime:ret[11]
                isConfirmed:ret[12]
                isClosed:ret[13]
            }
            this.setState(info);
        }).catch((error) => {
            console.log(error);
            message.error(error.message);
        });
    }

    getPaid = () => {
        const {payroll, account} = this.props;
        payroll.getPaid({
            from: account,
        }).then((ret) => {
            this.checkEmployee();
        }).catch((error) => {
            message.error(error.message);
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            salary: 0,
            lastPaidDate: '',
            balance: false,
        };
    }

    componentDidMount() {
        this.checkEmployee();
    }

    renderContent() {
        const {salary, lastPaidDate, balance} = this.state;

        if (!salary || salary === '0') {
            return <Alert message="你不是借款人" type="error" showIcon/>;
        }

        return (
            <div>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="借条地址">{address} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="出资地址">{creditName} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="借款地址">{debitName} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="借款金额">{salary} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="贷款时长">{dueTime} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="月利率">{monthRate} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="违约金利率">{defaultRate} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="共偿要还金额">{totalToPay} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="代付本金">{capitalToPay} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="开始时间">{startTime} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="借条终止时间">{lastTime} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="是否确认">{isConfirmed} </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="是否关闭">{isClosed} </Card>
                    </Col>
                </Row>

                <Button
                    type="primary"
                    icon="bank"
                    onClick={this.getPaid}
                >
                    还款
                </Button>
            </div>
        );
    }

    render() {
        const {account, payroll, web3} = this.props;

        return (
            <Layout style={{padding: '0 24px', background: '#fff'}}>
                <Common account={account} payroll={payroll} web3={web3}/>
                <h2>个人信息</h2>
                {this.renderContent()}
            </Layout>
        );
    }
}

export default Employer
