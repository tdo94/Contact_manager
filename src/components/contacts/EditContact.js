import React, { Component } from 'react';
import { Consumer } from '../../context';
import TextInputGroup from '../layout/TextInputGroup';
import axios from 'axios';

class EditContact extends Component {
    state = {
        name: '',
        email: '',
        phone: '',
        errors: {}
    };
    async componentDidMount() {
        const {id} = this.props.match.params;
        const res= await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        
        const contact = res.data;

        this.setState({
            name: contact.name,
            phone: contact.phone,
            email: contact.email
        })

    }

    onSubmit = async (dispatch, event) => {
        event.preventDefault();
        const { name, email, phone } = this.state;
        // Check for Errors
        if (name === ''){
            this.setState({errors: {name: 'Please fill in Name'}})
            return;
        }
        if (email === ''){
            this.setState({errors: {email: 'Please fill in Email'}})
            return;
        }
        if (phone === ''){
            this.setState({errors: {phone: 'Please fill in Phone Number'}})
            return;
        }
        
        const updContact = {
            name,
            phone,
            email
        }

        const {id} =this.props.match.params;
        const res= await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, updContact)

        dispatch({type: 'UPDATE_CONTACT', payload:res.data })
       
        //clear input field after submit
        this.setState({
            name: '',
            email: '',
            phone: '',
            errors: {}
        })

        this.props.history.push('/')
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        const { name, email, phone, errors } = this.state;
        return (
            <Consumer>
                {value => {
                    const { dispatch } = value;
                    return (
                        <div className='card mb-3'>
                            <div className='card-header'>
                                Edit Contact
                            </div>
                            <div className='card-body'>
                                <form onSubmit={this.onSubmit.bind(this, dispatch)}>
                                    <TextInputGroup
                                        label='Name'
                                        name='name'
                                        placeholder='Enter Name...'
                                        value={name}
                                        onChange={this.onChange}
                                        error={errors.name}
                                    />
                                    <TextInputGroup
                                        label='Email'
                                        type= 'email'
                                        name='email'
                                        placeholder='Enter Email...'
                                        value={email}
                                        onChange={this.onChange}
                                        error={errors.email}
                                    />
                                    <TextInputGroup
                                        label='Phone'
                                        name='phone'
                                        placeholder='Enter Phone Number...'
                                        value={phone}
                                        onChange={this.onChange}
                                        error={errors.phone}
                                    />
                                    <input type='submit' value='Update Contact'
                                        className='btn btn-light btn-block'
                                    />
                                </form>
                            </div>
                        </div>
                    )
                }}
            </Consumer>
        )

    }
}

export default EditContact;