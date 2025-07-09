# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

TO JS {"provider":"google","result":{"serverAuthCode":"4\/0AVMBsJhYxCDdLHAHdeD0ZHV8LO7uyCxSwnnaD*Mtbb0v6o8HsrOVfE1XlZ7_Uda6mavBGA","responseType":"offline"}}
⚡️ [log] - Google Login Result: {"provider":"google","result":{"serverAuthCode":"4/0AVMBsJhYxCDdLHAHdeD0ZHV8LO7uyCxSwnnaD_Mtbb0v6o8HsrOVfE1XlZ7_Uda6mavBGA","responseType":"offline"}}
⚡️ [log] - displayName undefined
⚡️ [log] - name undefined
⚡️ [log] - id undefined
⚡️ [log] - email undefined
⚡️ [log] - {"message":"Request failed with status code 400","name":"AxiosError","stack":"x4@capacitor://localhost/assets/index-QYPoZyY2.js:302:1094\nk@capacitor://localhost/assets/index-QYPoZyY2.js:302:5744\n@capacitor://localhost/assets/index-QYPoZyY2.js:304:2085","config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"adapter":["xhr","http","fetch"],"transformRequest":[null],"transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},"headers":{"Accept":"application/json, text/plain, */\_","Content-Type":"multipart/form-data"},"method":"post","url":"https://backend.tefop.co/register","data":{},"allowAbsoluteUrls":true},"code":"ERR_BAD_REQUEST","status":400}

--
login

---

⚡️ TO JS {"provider":"google","result":{"responseType":"offline","serverAuthCode":"4\/0AVMBsJiR3TBNNJVn6BdzISvfJPCG23Elg2_k817wl3Lz04RUsW1eKL0HLOz0KfSYlMU8bg"}}
⚡️ [log] - Google Login Result: {"provider":"google","result":{"responseType":"offline","serverAuthCode":"4/0AVMBsJiR3TBNNJVn6BdzISvfJPCG23Elg2_k817wl3Lz04RUsW1eKL0HLOz0KfSYlMU8bg"}}
⚡️ [log] - displayName undefined
⚡️ [log] - name undefined
⚡️ [log] - id undefined
⚡️ [log] - email undefined
⚡️ [log] - {"message":"Request failed with status code 400","name":"AxiosError","stack":"x4@capacitor://localhost/assets/index-QYPoZyY2.js:302:1094\nk@capacitor://localhost/assets/index-QYPoZyY2.js:302:5744\n@capacitor://localhost/assets/index-QYPoZyY2.js:304:2085","config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"adapter":["xhr","http","fetch"],"transformRequest":[null],"transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},"headers":{"Accept":"application/json, text/plain, _/_","Content-Type":"application/json"},"method":"post","url":"https://backend.tefop.co/login","data":"{\"playerId\":\"b156f618-4f53-4ab6-a0bf-f1d3d517b3ae\"}","allowAbsoluteUrls":true},"code":"ERR_BAD_REQUEST","status":400}
