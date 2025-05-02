import React, { useEffect, useState } from "react";

const UserProfile = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        address: "",
        phone_number: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);


    useEffect(() => {
            const fetchUser = async () => {
                try {
                    const response = await fetch('http://18.234.134.4:8000/api/user');
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setProfile(data);
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchUser();
        }, []);

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
                <h1>User Profile</h1>
                {error ? <p>Error: {error}</p> : (
            <div>
                {edit == true ? (
                        <>
                            <input type="text" name="name" placeholder="Name" value={profile.name} onChange={handleEdit} />
                            <input type="email" name="email" placeholder="Email" value={profile.email} onChange={handleEdit} />
                            <input type="text" name="address" placeholder="Address" value={profile.address} onChange={handleEdit} />
                            <input type="text" name="phone_number" placeholder="Phone Number" value={profile.phone_number} onChange={handleEdit} />
                            <button onClick={handleSave}>Save</button>
                        </>
                    ) : (
                        <>
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Address:</strong> {profile.address}</p>
                            <p><strong>Phone Number:</strong> {profile.phone_number}</p>
                            <button onClick={(() => (setEdit(true)))} >Edit Profile</button>
                        </>
                    )}
            </div>
        )}
            </div>
        );
};

export default UserProfile;