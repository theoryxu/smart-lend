import React, {Component} from 'react'
import {Table, Button, Modal, Form, InputNumber, DatePicker, Input, message, Popconfirm} from 'antd';

import EditableCell from './EditableCell';

const FormItem = Form.Item;

const columns = [{
    title: '借款金额',
    dataIndex: 'salary',
    key: 'salary',
}, {
    title: '借款时间',
    dataIndex: 'lastPayday',
    key: 'lastPayday',
}, {
    title: '借款期限',
    dataIndex: 'time',
    key: 'time',
}, {
    title: '利率',
    dataIndex: 'rate',
    key: 'rate',
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
}, {
    title: '操作',
    dataIndex: '',
    key: 'action'
}];

class EmployeeList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            employees: [],
            showModal: false
        };

        // columns[1].render = (text, record) => (
        //     <EditableCell
        //         value={text}
        //         onChange={this.updateEmployee.bind(this, record.address)}
        //     />
        // );

        columns[6].render = (text, record) => (
            <Popconfirm title="你确定删除吗?" onConfirm={() => this.removeEmployee(record.address)}>
                <a href="#">Delete</a>
            </Popconfirm>
        );
    }

    componentDidMount() {
        const { payroll, account } = this.props;
        payroll.getEmployerInfo.call({
            from: account
        }).then((result) => {
            const employeeCount = result[2].toNumber();

            if (employeeCount === 0) {
                this.setState({loading: false});
                return;
            }
            this.loadEmployees(employeeCount);
        });
    }

    loadEmployees(employeeCount) {
        const {payroll, account, web3} = this.props;
        const requests = [];
        for (let index = 0; index < employeeCount; index++) {
            requests.push(payroll.getEmployeeInfo.call(index, {from: account}))
        }
        Promise.all(requests)
            .then(values => {

                console.log(values);    //加载借条信息列表

                const employees = values.map(value => ({
                    key: value[0],
                    salary: web3.fromWei(value[1].toNumber()),
                    lastPayday: new Date(value[2].toNumber() * 1000).toString(),
                    time:value[3],
                    rate:value[4],
                    status:value[5],
                }));
                this.setState({
                    employees: employees,
                    loading: false,
                });
            });
    }

    addEmployee = () => {
        const {payroll, account} = this.props;
        const {address, salary, employees} = this.state;
        payroll.addEmployee(address, salary, {
            from: account,
            gas: 1000000,
        }).then(() => {
            const newEmployee = {
                address,
                salary,
                key: address,
                lastPayday,
                time,
                rate
            }
            this.setState({
                showModal: false,
                employees: employees.concat([newEmployee]),
            });
        });
    }

    // updateEmployee = (address, salary) => {
    //     const { payroll, account } = this.props;
    //     const { employees } = this.state;
    //     payroll.updateEmployee(address, salary, {
    //         from: account,
    //         gas: 1000000,
    //     }).then((ret) => {
    //         console.log(ret);
    //         this.setState({
    //             employees: employees.map((employee) => {
    //                 if (employee.address === address) {
    //                     employee.salary = salary;
    //                 }
    //                 return employee;
    //             })
    //         });
    //     }).catch((error) => {
    //         message.error(error.message);
    //     });
    // }

    removeEmployee = (employeeId) => {
        const { payroll, account } = this.props;
        const { employees } = this.state;
        payroll.removeEmployee(employeeId, {
            from: account,
            gas: 1000000,
        }).then(() => {
            this.setState({
                showModal: false,
                employees: employees.filter((employee) => employee.address !== employeeId)
            });
        }).catch((error) => {
            message.error(error.message);
        });
    }

    renderModal() {
        return (
            <Modal
                title="新增借条"
                visible={this.state.showModal}
                onOk={this.addEmployee}
                onCancel={() => this.setState({showModal: false})}
            >
                <Form>
                    <FormItem label="地址">
                        <Input
                            onChange={ev => this.setState({address: ev.target.value})}
                        />
                    </FormItem>

                    <FormItem label="借款金额">
                        <InputNumber
                            min={1}
                            onChange={salary => this.setState({salary})}
                        />
                    </FormItem>

                    <FormItem label="借款时间">
                        <DatePicker onChange={lastPayday => this.setState({lastPayday})} />
                    </FormItem>

                    <FormItem label="借款期限">
                        <Input
                            onChange={time => this.setState({time})}
                        />
                    </FormItem>

                    <FormItem label="利率">
                        <Input
                            onChange={rate => this.setState({rate})}
                        />
                    </FormItem>
                    
                </Form>
            </Modal>
        );
    }

    render() {
        const {loading, employees} = this.state;
        return (
            <div>
                <Button
                    type="primary"
                    onClick={() => this.setState({showModal: true})}
                >
                    增加借条
                </Button>

                {this.renderModal()}

                <Table
                    loading={loading}
                    dataSource={employees}
                    columns={columns}
                />
            </div>
        );
    }
}

export default EmployeeList
