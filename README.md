# quantius-ui
A lightweight, extensible framework library that lets you create functional, minimalistic, and high quality apps. Compatible with both React and Preact. This is used by Quantius Labs in the development of their sites and associated products.

Development is easy and straightforward with Quantius UI.
Example:
```jsx
const Fallback404 = () => {
    return <Frame>
        <CenterLine>
           <Paragraph>Page Not Found</Paragraph>
        </CenterLine>
        <Break/>
        <Flexbox center="middle">
            <Frame maxWidth="500px" border="1.2px solid #aaa" borderRadius="10px" padding="28px 34px">
                <Paragraph fmt="p">We're so sorry, but this page could not be found.</Paragraph>
                <Break/>
                <PButton url="/">Go home</PButton>
            </Frame>
        </Flexbox>
    </Frame>
}

export default Fallback404;
```

The result:

<img width="406" height="219" alt="{D044DA28-EFCA-43AA-8C84-B33DACD69427}" src="https://github.com/user-attachments/assets/2ad92ed7-68d5-46e7-a019-5257ce6df68d" />
