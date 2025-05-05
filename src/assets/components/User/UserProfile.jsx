import React, { useEffect, useState } from "react";

const UserProfile = ({onAuthSuccess}) => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        address: "",
        phone_number: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);


    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const response = await fetch('http://18.234.134.4:8000/api/user', {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 }
    //             });
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }
    //             const data = await response.json();
    //             setProfile(data);
    //         } catch (err) {
    //             setError(err.message);
    //         }
    //     };
    //     fetchUser();
    // }, []);

    const handleEdit = (event) => {
        setProfile({
            ...profile,
            [event.target.name]: event.target.value,
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://18.234.134.4:8000/api/user', {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });

            if (!response.ok) {
                throw new Error(`Failed to update profile: ${response.status}`);
            }
            setEdit(false);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1 className="font-bold text-white text-5xl m-8">User Profile</h1>
            {error ? <p>Error: {error}</p> : (
                <div>
                    {edit == true ? (
                        <>
                            <input className="bg-white m-4 rounded"
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={profile.name}
                                onChange={handleEdit} />
                            <input className="bg-white m-4 rounded"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={profile.email}
                                onChange={handleEdit} />
                            <input className="bg-white m-4 rounded"
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={profile.address}
                                onChange={handleEdit} />
                            <input className="bg-white m-4 rounded"
                                type="text"
                                name="phone_number"
                                placeholder="Phone Number"
                                value={profile.phone_number}
                                onChange={handleEdit} />
                            <button className="hover:bg-green-700 cursor-pointer text-white bg-black border-solid border-black rounded border-2 px-1 m-4"
                                onClick={handleSave}>Save</button>
                        </>
                    ) : (
                        <>
                        <div className="container py-8 w-5/12 h-5/6 mx-auto bg-yellow-50 items-center border-solid border-black rounded border-2">
                            <p className="text-2xl">Name: {profile.name}</p>
                            <p className="text-2xl">Email: {profile.email}</p>
                            <p className="text-2xl">Address: {profile.address}</p>
                            <p className="text-2xl">Phone Number: {profile.phone_number}</p>
                            <button className="text-lg hover:bg-green-700 cursor-pointer text-white bg-black border-solid border-black rounded border-2 px-1 m-4"
                            onClick={(() => (setEdit(true)))} >Edit Profile</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfile;