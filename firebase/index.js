import { createUserWithEmailAndPassword, initializeAuth, signInWithEmailAndPassword, updateProfile, getReactNativePersistence, getAuth, signOut } from "firebase/auth"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, setDoc, getDoc, getDocs, where, query, doc, addDoc, collection } from "firebase/firestore"
import { uploadToCloudinary } from "../utils/utils";

const firebaseConfig = {
    apiKey: "AIzaSyD1lPJyEjsK1m18LklMFdXLcR3718FeMiA",
    authDomain: "eprocess-asset-manager.firebaseapp.com",
    projectId: "eprocess-asset-manager",
    storageBucket: "eprocess-asset-manager.appspot.com",
    messagingSenderId: "915827459737",
    appId: "1:915827459737:web:2bc800c544564d62d3da08",
    measurementId: "G-9H3NFDN15D"
}
const startApp = () => {
    const app = initializeApp(firebaseConfig);
    initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
    return app;
}
export const app = getApps().length ? getApp() : startApp();
export const auth = getAuth(app);
const db = getFirestore(app);
const assetCollectionRef = collection(db, "assets");

export const createUserFirebase = (user, callback) => {
    createUserWithEmailAndPassword(auth, `${user.username}@ecobank.com`, user.password).then((userCredential) => {
        const userFirebase = userCredential.user;
        updateProfile(userFirebase, {
            displayName: user.subDetails
        }).then(() => {
            signOut(auth);
            callback("success", null)
        }).catch((e) => {
            console.log(e)
        })
    }).catch((error) => {
        if (error.code == "auth/email-already-in-use") {
            callback(null, "The username is taken");
        } else if (error.code == "auth/operation-not-allowed") {
            callback(null, "Operation not allowed.");
        } else if (error.code == "auth/invalid-email") {
            callback(null, "Unsupported username format");
        } else if (error.code == "auth/weak-password") {
            callback(null, "The password is too weak.");
        }
    })
}
export const signInUserFirebase = (user, callback) => {
    signInWithEmailAndPassword(auth, `${user.username}@ecobank.com`, user.password)
    .then((userCredential) => {
        console.log(userCredential.user);
    }).catch((error) => {
        if (error.code == "auth/invalid-email") {
            callback(null, "Unsupported username format");
        } else if (error.code == "auth/invalid-login-credentials") {
            callback(null, "Incorrect username or password");
        } else if (error.code == "auth/operation-not-allowed") {
            callback(null, "Operation not allowed.");
        } else {    
            callback(null, "An error occured");
        }
    })
}
export const createAsset = async (asset, callback) => {
    const uniqueName = `asset-${Date.now() + Math.floor(Math.random() * 1000000)}`;
    try {
        console
        const res = await uploadToCloudinary("samuraidev", asset.image.uri, uniqueName, "839935435497676", "zjuuiycx")
        delete asset.image;
        await addDoc(assetCollectionRef, {
            image: res.secure_url,
            return_date: "",
            return_image: "",
            return_reason: "",
            ...asset
        })
        callback("success", null);
    } catch (e) {
        console.log(e);
        callback(null, "An error occured");
    }
}
export const getSingleAsset = async (id, callback) => {
    try {
        const singleAsset = await getDoc(doc(db, "assets", id));
        if(singleAsset.exists()) {  
            callback(singleAsset.data(), null);
        } else {
            callback(null, "Asset not found");
        }
    } catch (e) {    
        callback(null, "An error occured");
    }
}
export const getAllAsset = async (userId, callback) => {
    const q = query(assetCollectionRef, where("user_id", "==", userId));
    try {  
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach(doc => {
            data.push({id: doc.id, ...doc.data()})
        })
        callback(data, null);
    } catch (e) {
        callback(null, "An error occured");
    }
}
export const updateAsset = async (asset, callback) => {
    const uniqueName = `asset-return-${Date.now() + Math.floor(Math.random() * 1000000)}`;
    try {
        console
        const res = await uploadToCloudinary("samuraidev", asset.return_image.uri, uniqueName, "839935435497676", "zjuuiycx")
        delete asset.return_image;
        const assetRef = doc(db, "assets", asset.id)
        await setDoc(assetRef, {
            return_date: asset.return_date,
            return_image: res.secure_url,
            return_reason: asset.return_reason,
            status: asset.status
        }, { merge: true })
        callback("success", null);
    } catch (e) {
        console.log(e);
        callback(null, "An error occured");
    }
}
