import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ContactService } from "../../../services/ContactService";

let EditContact = () => {

    let { contactId } = useParams();

    const navigate = useNavigate()

    const [state, setState] = useState({
        loading: false,
        contact: {
            name: '',
            photo: '',
            mobile: '',
            email: '',
            company: '',
            title: '',
            groupId: ''
        },
        errorMessage: "",
        groups: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setState({ ...state, loading: true });
                let response = await ContactService.getContact(contactId);
                let groupResponse = await ContactService.getGroups()
                setState({
                    ...state,
                    loading: false,
                    contact: response.data,
                    groups: groupResponse.data
                });
            } catch (error) {
                setState({
                    ...state,
                    loading: false,
                    errorMessage: error.message
                });
            }
        };

        fetchData();
    }, [contactId]);

    let updateInput = (e) => {
        setState({
            ...state,
            contact: {
                ...state.contact,
                [e.target.name]: e.target.value
            }
        })
    }

    const formSubmit = async (e)=>{
        e.preventDefault();

        try{
            let response = await ContactService.updateContact(state.contact, contactId)
            if(response){
                navigate('/contacts/list', {replace :true})
            }
        } catch(error ){
            setState({...state, errorMessage : error.message})
            navigate(`/contacts/edit/${contactId}`, {replace : false})
        }
    }


    // Check if state is not undefined before destructuring
    let { loading, contact, errorMessage, groups } = state;

    return (
        <>
            <section className="edit-contact p-3">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <p className="h3 text-info fw-bold">Edit Contact</p>
                            <p className="fst-italic">hello this is the cantact creating page</p>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-4">
                            <form onSubmit={formSubmit}>
                                <div className="mb-2">
                                    <input
                                        required={true}
                                        name="name"
                                        value={contact.name}
                                        onChange={updateInput}
                                        type="text" className="form-control" placeholder="Name" />
                                </div>
                                <div className="mb-2">
                                    <input
                                        required={true}
                                        name="photo"
                                        value={contact.photo}
                                        onChange={updateInput}
                                        type="text" className="form-control" placeholder="Photo Url - Country Flag" />
                                </div>
                                <div className="mb-2">
                                    <input
                                        required={true}
                                        name="mobile"
                                        value={contact.mobile}
                                        onChange={updateInput}
                                        type="number" className="form-control" placeholder="Mobile Number" />
                                </div>
                                <div className="mb-2">
                                    <input
                                        required={true}
                                        name="email"
                                        value={contact.email}
                                        onChange={updateInput}
                                        type="email" className="form-control" placeholder="Email" />
                                </div>
                                <div className="mb-2">
                                    <input
                                        name="title"
                                        value={contact.title}
                                        onChange={updateInput}
                                        type="text" className="form-control" placeholder="Description" />
                                </div>
                                <div className="mb-2">
                                    <select
                                        required={true}
                                        name="groupId"
                                        value={contact.groupId}
                                        onChange={updateInput}
                                        className="form-control">
                                        <option value="">Select a Group</option>
                                        {
                                            groups.length > 0 &&
                                            groups.map(group => {
                                                return (
                                                    <option key={group.id} value={group.id}>{group.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <input type="submit" className="btn btn-info" value="Update" />
                                    <Link to={'/contacts/list'} className="btn btn-dark ms-2">Cancel</Link>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-6">
                            <img src={contact.photo} alt="" className="contact-img" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default EditContact;