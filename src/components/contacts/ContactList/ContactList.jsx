import React, { useEffect, useState, input, value } from "react";
import { Link, json } from "react-router-dom";
import { ContactService } from "../../../services/ContactService";
import { initialState } from 'react';
import Spinner from "../../Spinner/Spinner";

let ContactList = () => {


    const [state, setState] = useState({
        loading: false,
        contacts: [],
        errorMessage: '',
        filteredContacts : []
    });

    const [query, setquery] = useState({
        text: ''
    });

    useEffect(() => {
        (async () => {
            try {
                setState({ ...state, loading: true });
                let response = await ContactService.getAllContacts();
                setState({
                    ...state,
                    loading: false,
                    contacts: response.data,
                    filteredContacts : response.data
                });
            } catch (error) {
                setState({
                    ...state,
                    loading: false,
                    errorMessage: error.message
                });
            }
        })();
    }, []);


    // Delete contact
    let clickDelete = async (contactId) => {
        try {
            let response = await ContactService.deleteContact(contactId);
            if (response) {
                setState({ ...state, loading: true });
                let response = await ContactService.getAllContacts();
                setState({
                    ...state,
                    loading: false,
                    contacts: response.data,
                    filteredContacts : response.data
                })
            }
        } catch (error) {
            setState({
                ...state,
                loading: false,
                errorMessage: error.message
            });
        }
    }

    // search contacts
    const searchContacts = (e) => {
        e.preventDefault();
        setquery({ ...query, text: e.target.value })

        let theContacts = state.contacts.filter(contact => {
            return contact.name.toLowerCase().includes(e.target.value.toLowerCase());
        })

        setState({
            ...state,
            filteredContacts : theContacts
        })
    }

    // Check if state is not undefined before destructuring
    let loading, contacts, errorMessage, filteredContacts;
    if (state) {
        loading = state.loading;
        contacts = state.contacts;
        errorMessage = state.errorMessage;
        filteredContacts = state.filteredContacts;
    }


    return (
        <>
            <section className="contact-search p-2">
                <div className="container">
                    <div className="grid">
                        <div className="row">
                            <div className="col">
                                <p className="h3">Introduction to EngageSync : </p>
                                <p className="fst-italic">
                                    EngageSync, the ultimate contact manager designed to streamline your connections effortlessly. With EngageSync, you can effortlessly organize, track, and nurture your network like never before. Seamlessly synchronize all your important contacts, keeping vital information at your fingertips. EngageSync empowers you to build meaningful relationships, cultivate collaborations, and stay in touch with ease. Its intuitive interface and powerful features make managing your contacts a breeze. Take control of your network and unlock new opportunities with EngageSync, your trusted partner in effective relationship management.
                                </p>
                                <p className="h3 text-center p-5 fw-bold" >Contact Manager
                                    <Link to={'/contacts/add'} className="btn btn-dark ms-2">
                                        <i className="fa fa-plus-circle me-2" />
                                        Add Contact</Link>
                                </p>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col-md-6 ">
                                <form action="" className="row " >
                                    <div className="col">
                                        <div className="mb-2">
                                            <input
                                                name="text"
                                                value={query.text}
                                                onChange={searchContacts}
                                                type="text" className="form-control" placeholder="Search Names" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="mb-2">
                                            <input type="submit" className="btn btn-outline-dark" value="Search" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {
                loading ? <Spinner /> : <>
                    <section className="contact-list">
                        <div className="container">
                            <div className="row">
                                {
                                    filteredContacts.length > 0 &&
                                    filteredContacts.map(contact => {
                                        return (
                                            <div className="col-md-6" key={contact.id}>
                                                <div className="card my-2">
                                                    <div className="card-body">
                                                        <div className="row align-items-center d-flex justify-content-around">
                                                            <div className="col-md-4">
                                                                <img src={contact.photo} className="contact-img" alt="" />
                                                            </div>
                                                            <div className="col-md-7">
                                                                <ul className="list-group">
                                                                    <li className="list-group-item list-group-item-action">
                                                                        Name : <span className="fw-bold">{contact.name}</span>
                                                                    </li>
                                                                    <li className="list-group-item list-group-item-action">
                                                                        Mobile : <span className="fw-bold">{contact.mobile}</span>
                                                                    </li>
                                                                    <li className="list-group-item list-group-item-action">
                                                                        Email : <span className="fw-bold">{contact.email}</span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="col-md-1 d-flex flex-column align-items-center">
                                                                <Link to={`/contacts/view/${contact.id}`} className="btn btn-warning my-1">
                                                                    <i className="fa fa-eye" />
                                                                </Link>
                                                                <Link to={`/contacts/edit/${contact.id}`} className="btn btn-info my-1">
                                                                    <i className="fa fa-pen" />
                                                                </Link>
                                                                <button className="btn btn-danger my-1" onClick={() => clickDelete(contact.id)}>
                                                                    <i className="fa fa-trash" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </section>
                </>
            }

        </>
    )
}

export default ContactList;