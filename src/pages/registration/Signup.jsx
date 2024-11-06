import React, { useContext, useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Header, Segment, Step, Divider } from "semantic-ui-react";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import './Signup.css';

  const countryList = [
    { name: "Albania" },
    { name: "Andorra" },
    { name: "Armenia" },
    { name: "Austria" },
    { name: "Azerbaijan" },
    { name: "Belarus" },
    { name: "Belgium" },
    { name: "Bosnia and Herzegovina" },
    { name: "Bulgaria" },
    { name: "Croatia" },
    { name: "Cyprus" },
    { name: "Czech Republic" },
    { name: "Denmark" },
    { name: "Estonia" },
    { name: "Finland" },
    { name: "France" },
    { name: "Georgia" },
    { name: "Germany" },
    { name: "Greece" },
    { name: "Hungary" },
    { name: "Iceland" },
    { name: "Ireland" },
    { name: "Italy" },
    { name: "Kazakhstan" },
    { name: "Kosovo" },
    { name: "Latvia" },
    { name: "Liechtenstein" },
    { name: "Lithuania" },
    { name: "Luxembourg" },
    { name: "Malta" },
    { name: "Moldova" },
    { name: "Monaco" },
    { name: "Montenegro" },
    { name: "Netherlands" },
    { name: "North Macedonia" },
    { name: "Norway" },
    { name: "Poland" },
    { name: "Portugal" },
    { name: "Romania" },
    { name: "Russia" },
    { name: "San Marino" },
    { name: "Serbia" },
    { name: "Slovakia" },
    { name: "Slovenia" },
    { name: "Spain" },
    { name: "Sweden" },
    { name: "Switzerland" },
    { name: "Turkey" },
    { name: "Ukraine" },
    { name: "United Kingdom" },
    { name: "Vatican City" }
  ];

  
const Signup = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    const [userSignup, setUserSignup] = useState({
        name: "",
        email: "",
        password: "",
        dateOfBirth: "",
        country: "",
        profession: "",
        role: "user"
    });

    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        dateOfBirth: false,
        country: false,
        profession: false,
    });

    const [step, setStep] = useState(1); // Track the current step

    // Revalidate the form when a field is updated
    const handleChange = (e, { name, value }) => {
        setUserSignup({ ...userSignup, [name]: value });
        
        // Revalidate the specific field
        setErrors({ ...errors, [name]: value === "" });
    };

    const nextStep = () => {
        if (step === 1) {
            const newErrors = {
                name: userSignup.name === "",
                email: userSignup.email === "",
                password: userSignup.password === ""
            };
            setErrors(newErrors);
            if (!Object.values(newErrors).includes(true)) {
                setStep(step + 1);
            }
        } else if (step === 2) {
            const newErrors = {
                dateOfBirth: userSignup.dateOfBirth === "",
                country: userSignup.country === "",
                profession: userSignup.profession === ""
            };
            setErrors(newErrors);
            if (!Object.values(newErrors).includes(true)) {
                setStep(step + 1);
            }
        }
    };

    const prevStep = () => setStep(step - 1);

    const userSignupFunction = async () => {
        if (
            userSignup.name === "" || 
            userSignup.email === "" || 
            userSignup.password === "" || 
            userSignup.dateOfBirth === "" || 
            userSignup.country === "" || 
            userSignup.profession === ""
        ) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);
        try {
            const users = await createUserWithEmailAndPassword(auth, userSignup.email, userSignup.password);

            const user = {
                name: userSignup.name,
                email: users.user.email,
                uid: users.user.uid,
                dateOfBirth: userSignup.dateOfBirth,
                country: userSignup.country,
                profession: userSignup.profession,
                role: userSignup.role,
                time: Timestamp.now(),
                date: new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }
                )
            };

            const userReference = collection(fireDB, "user");
            await addDoc(userReference, user);

            setUserSignup({
                name: "",
                email: "",
                password: "",
                dateOfBirth: "",
                country: "",
                profession: ""
            });

            toast.success("Signup Successfully");
            setLoading(false);
            navigate('/login');
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error("Signup failed. Please try again.");
        }
    };

    return (
        <div className='signup-bg'>
            {loading && <Loader />}
            <Segment style={{ maxWidth: '600px', margin: 'auto', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <Header as="h2" textAlign="center" color="blue" style={{ marginBottom: '20px' }}>
                    Signup
                </Header>

                <Step.Group ordered fluid style={{ marginBottom: '15px', padding: '0', fontSize: '0.8em' }}>
                    <Step active={step === 1} style={{ padding: '5px' }}>
                        <Step.Content>
                            <Step.Title style={{ fontSize: '0.9em' }}>Account</Step.Title>
                            <Step.Description style={{ fontSize: '0.75em' }}>Enter your account details</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step active={step === 2} style={{ padding: '5px' }}>
                        <Step.Content>
                            <Step.Title style={{ fontSize: '0.9em' }}>Personal</Step.Title>
                            <Step.Description style={{ fontSize: '0.75em' }}>Enter your personal details</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step active={step === 3} style={{ padding: '5px' }}>
                        <Step.Content>
                            <Step.Title style={{ fontSize: '0.9em' }}>Review</Step.Title>
                            <Step.Description style={{ fontSize: '0.75em' }}>Review and submit your details</Step.Description>
                        </Step.Content>
                    </Step>
                </Step.Group>

                {step === 1 && (
                    <Form>
                        <Form.Input
                            fluid
                            label="Full Name"
                            placeholder="Full Name"
                            name="name"
                            value={userSignup.name}
                            onChange={handleChange}
                            error={errors.name && { content: 'Name is required', pointing: 'below' }}
                        />
                        <Form.Input
                            fluid
                            label="Email Address"
                            placeholder="Email Address"
                            name="email"
                            type="email"
                            value={userSignup.email}
                            onChange={handleChange}
                            error={errors.email && { content: 'Email is required', pointing: 'below' }}
                        />
                        <Form.Input
                            fluid
                            label="Password"
                            placeholder="Password"
                            name="password"
                            type="password"
                            value={userSignup.password}
                            onChange={handleChange}
                            error={errors.password && { content: 'Password is required', pointing: 'below' }}
                        />
                        {Object.values(errors).some(error => error) && (
                            <div className="error-message">All fields are required</div>
                        )}
                        <Button.Group fluid style={{ marginTop: '15px' }}>
                            <Button onClick={nextStep} primary>
                                Next
                            </Button>
                        </Button.Group>
                    </Form>
                )}

                {step === 2 && (
                    <Form>
                        <Form.Input
                            fluid
                            label="Date of Birth"
                            placeholder="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={userSignup.dateOfBirth}
                            onChange={handleChange}
                            error={errors.dateOfBirth && { content: 'Date of birth is required', pointing: 'below' }}
                        />
                        <Form.Select
                            fluid
                            label="Country"
                            name="country"
                            options={countryList.map((country) => ({
                                key: country.name,
                                text: country.name,
                                value: country.name,
                            }))}
                            placeholder="Select Country"
                            value={userSignup.country}
                            onChange={(e, { value }) => handleChange(e, { name: 'country', value })}
                            error={errors.country && { content: 'Country is required', pointing: 'below' }}
                        />
                        <Form.Input
                            fluid
                            label="Profession"
                            placeholder="Profession"
                            name="profession"
                            value={userSignup.profession}
                            onChange={handleChange}
                            error={errors.profession && { content: 'Profession is required', pointing: 'below' }}
                        />
                        {Object.values(errors).some(error => error) && (
                            <div className="error-message">All fields are required</div>
                        )}
                        <Button.Group fluid style={{ marginTop: '15px' }}>
                            <Button onClick={prevStep} secondary>
                                Back
                            </Button>
                            <Button onClick={nextStep} primary>
                                Next
                            </Button>
                        </Button.Group>
                    </Form>
                )}

                {step === 3 && (
                    <Segment padded="very" style={{ backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                        <Header as="h3" textAlign="center">Review Your Details</Header>
                        <p><strong>Full Name:</strong> {userSignup.name}</p>
                        <p><strong>Email Address:</strong> {userSignup.email}</p>
                        <p><strong>Date of Birth:</strong> {userSignup.dateOfBirth}</p>
                        <p><strong>Country:</strong> {userSignup.country}</p>
                        <p><strong>Profession:</strong> {userSignup.profession}</p>
                        <Button.Group fluid style={{ marginTop: '15px' }}>
                            <Button onClick={prevStep} secondary>
                                Back
                            </Button>
                            <Button onClick={userSignupFunction} positive>
                                Submit
                            </Button>
                        </Button.Group>
                    </Segment>
                )}

                <Divider style={{ marginTop: '25px' }} />

                <div style={{ textAlign: 'center' }}>
                    <p>
                        Have an account? <Link className='signup-link' to={'/login'}>Login</Link>
                    </p>
                </div>
            </Segment>
        </div>
    );
}

export default Signup;
