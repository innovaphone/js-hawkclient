# HawkClient for Innovaphone SDK

A minimal JavaScript module that enables HAWK-authenticated HTTP requests using the Innovaphone SDK's `HttpClient`.  
Ideal for communicating with APIs secured using the [HAWK authentication protocol](https://github.com/mozilla/hawk).

---

## 🚀 Features

- Lightweight and dependency-free  
- Designed for use with the Innovaphone App Platform / SDK  
- Generates valid HAWK headers (MAC, timestamp, nonce)  
- Simplifies authenticated API access  

---

## 📦 Usage Example

```javascript
var credentials = {
    id: "<HAWK-ID>",        // Your Hawk ID
    key: "<HAWK-KEY>"       // Your shared secret key
};

var url = "<API-URL>";      // Full HTTPS URL to the resource

HawkClient.request("GET", url, credentials, function (status, response) {
    if (status === 200) {
        log("Response received:");
        log(response);
    } else {
        log("Initial request failed with status " + status);
        log(response);
    }
});
```

---

## 📁 Integration in Innovaphone SDK Backend Services

To use this module within your Innovaphone SDK backend (JavaScript service):

1. **Place `service-hawkclient.js` in your service directory**, for example:

    ```
    /app/service/service-hawkclient.js
    ```

2. **Include the module in your service script** using a relative path:

    ```javascript
    include("service-hawkclient.js");
    ```

3. **Use the module as needed** in your service logic:

    ```javascript
    HawkClient.request("GET", url, credentials, function (status, response) {
        // handle response
    });
    ```

> ✅ This ensures that the HAWK authentication logic is cleanly separated and reusable within your Innovaphone SDK service.

---

## 🧱 Requirements

This module relies on the following APIs provided by the Innovaphone JavaScript runtime:

- `HttpClient` – for making HTTP(S) requests  
- `Crypto.hmac("SHA256", key)` – for HMAC generation  
- `Encoding.binToBase64()` – for base64 encoding  
- `TextDecoder("utf-8")` – for decoding binary responses  

---

## 📄 License

MIT License – free to use, modify, and distribute.

---

## ✍️ Author

Created for use with the [Innovaphone SDK](https://sdk.innovaphone.com/).  
Tested with HAWK-secured APIs such as Gigaset's Grape API.
