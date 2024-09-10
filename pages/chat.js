import Script from "next/script";

const Chat = () => {
    return (
        <>
            <h1>Kipitos😺🐭🐰🦝🦊</h1>
            <Script
                id="cid0020000386990923995"
                data-cfasync="false"
                async
                src="//st.chatango.com/js/gz/emb.js"
                style="width: 600px;height: 680px;"
                strategy="lazyOnload"
            >
                {`{"handle":"kipitos","arch":"js","styles":{"a":"339999","b":100,"c":"FFFFFF","d":"FFFFFF","k":"339999","l":"339999","m":"339999","n":"FFFFFF","p":"10","q":"339999","r":100}}`}
            </Script>
        </>
    );
};

export default Chat;
