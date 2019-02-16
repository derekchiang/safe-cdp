
import React, { Component, Fragment } from 'react';
import { Pie } from 'react-chartjs-2';
import {Link} from 'react-router-dom';


import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
// import Share from '@material-ui/icons/Share';
import Add from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';



import '../CSS/Dashboard.css';
import SideBar from './Sidebar.js';
// import Cookies from 'universal-cookie';
import axios from 'axios';

// const cookies = new Cookies()
const serverURL = process.env.REACT_APP_LOCAL_URL

const styles = {
    buttonTop: {
        display: 'block',
        margin: '10% auto',
        width: '50%',
        height: '30%',
    },
    buttonBottom: {
        width: '20%',
        minWidth: '200px',
        height: '100px',
        margin: '15px 5px'
    },
};


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            userLoaded: false,
            registryLink: "",
            displayName: "",
            registry: [],
            registering: false,
            rsvps: [0, 0, 0],
            attending: 0,
            notAttending: 0,
            maybe: 0,
        }
    }

    inputHandler = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    loadUser = () =>{
        this.setState({
            userLoaded: true 
         }) 
    }

    toggleRegistering = () =>{

        this.setState({
            registering: false
        })

    }

    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        const vbtoken = localStorage.getItem('vbtoken'); //"VB Token"; this is a token created in the Passport redirect function, and set in a cookie in the Axios response below. Purpose here is to check if the user is still logged in(expires in 10m)
        const oauth_id = params.get("vbTok"); //Hashed OAuth ID set in the query section of the Passport redirect URL. 
        const userExists = Number(params.get("vbEx")); // Boolean set in the query section of the Passport redirect URL that determines if the user exists or not.
        
        if(this.props.registered || userExists || vbtoken){
            axios.post(`${serverURL}/loaduser`, {oauth_id, vbtoken})
            .then(res => {
                console.log(res)
                localStorage.setItem('vbtoken', oauth_id || vbtoken)
                localStorage.setItem('weddingID', res.data.couple[0].wedding_id)
                this.props.login() //toggles the state of the user to loggedIn (in MainContent component)
                this.props.setUser(res.data.couple[0], res.data.couple[1], res.data.guests, [ {...res.data.couple[0]}, {...res.data.couple[1]} ], res.data.wedding_data.event_address, res.data.wedding_data.event_date, res.data.couple[0].email, res.data.couple[0].phone);
                this.props.toggleRegistered();
                
                this.setState({
                        rsvps: res.data.rsvpResults,
                        attending: res.data.rsvpResults['Attending'],
                        notAttending: res.data.rsvpResults['Not Attending'], 
                        maybe: res.data.rsvpResults['Maybe'],
                        userLoaded: true 
                     })   
                
            })
            .then(() => {
                const w_id = localStorage.getItem('weddingID');
                axios
                .get(`${serverURL}/${w_id}/registries`)
                .then(res => {
                        this.setState({ registry: res.data })
                })
            })
            .catch(err => console.log(err))
        }
        
        else if(oauth_id && !userExists){
            localStorage.setItem('authID', oauth_id)
            this.setState({registering: true})
        } 
        else {
            this.props.history.push('/signup')
        }
    }

    

    // add a registry to the database
    addRegistry = () => {
        axios
            .post(`${serverURL}/registry`, {
                wedding_id: localStorage.getItem('weddingID'),
                link: this.state.registryLink,
                name: this.state.displayName
            })
            .then(res => {
                console.log(res);
                this.setState({ registry: res.data });
                this.handleClose();
            })
            .catch(err => console.log(err));
    };

    // must use "multipart/form-data" when including a file in the body of a POST request
    handleonDrop = (files, rejectedFiles) => {
        const wedding_id = localStorage.getItem('weddingID')
        files.forEach(file => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', file.name);
            formData.append('wedding_id', wedding_id);
            axios.post(`${serverURL}/upload`, formData)
                .then((res => {
                    console.log(res)
                }))
                .catch(err => {
                    console.log(err)
                })
        });
    }

    // functions to open and close modal
    handleOpen = () => {
        this.setState({ modalOpen: true });
    };

    handleClose = () => {
        this.setState({ modalOpen: false });
    };

    render() {
        let {first_name, p_firstname, event_address, event_date} = this.props.userData
        
        return (
            
        <div className="dashboard">
            
            {/* {   this.state.registering ? <ClientSelections registering={this.state.registering} 
                                                           login={this.props.login} setUser={this.props.setUser} 
                                                           loadUser={this.loadUser} 
                                                           toggleRegistering={this.toggleRegistering}/> :
                
                !this.state.userLoaded ? <div className="loading">
                                            <div className="logo-wrap">
                                                <img src={require('../Main/images/beloved_mark_pink.png')} alt="vbeloved-logo"/>
                                            </div>
                                            <div className="load-txt">Loading...</div>
                                       </div> :  */}

            <Fragment>

                <SideBar />    
                <Card className="invite-link">
                card
            </Card>
            <div className="cardDivTop">
                <Card className="cardTopLeft" style={styles.cardTopLeft}>
                    Guest List
                </Card>
                <Card className="cardTopRight">
                    RSVP
                    <Pie data={{
                            labels: [
                                'Attending',
                                'Not Attending',
                                'Maybe'
                            ],
                            datasets: [{
                                data: [this.state.attending, this.state.notAttending, this.state.maybe],
                                backgroundColor: [
                                    '#FF6384',
                                    '#36A2EB',
                                    '#FFCE56'
                                ],
                                hoverBackgroundColor: [
                                    '#FF6384',
                                    '#36A2EB',
                                    '#FFCE56'
                                ]
                            }]
                        }}
                        style={styles.pieChart}
                        options={{ maintainAspectRatio: false }}
                    />
                </Card>
            </div>
            <div>
            <Card className="registry">
                Registry
                <CardContent>
                    {this.state.registry.map((r, i) => {
                        return(
                            <Button key={i} variant="outlined" style={styles.buttonBottom} href={r.link} target="_blank">
                                {r.name}
                            </Button>
                        )
                    })}
                    <Button variant="outlined" style={styles.buttonBottom} onClick={this.handleOpen}>
                        <Add />
                        Add Registry
                    </Button>
                </CardContent>
            </Card>
            <Modal
                open={this.state.modalOpen}
                onClose={this.handleClose}>
                
            </Modal>
            </div>
            </div>
            </Fragment>
            }
        </div>
        )
    }

}

export default Dashboard;
