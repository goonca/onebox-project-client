import { useRef } from 'react';

export default function Test() {
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  const submitForm = () => {
    const formData = new FormData();

    //@ts-ignore
    formData.append('name', textRef.current?.value);
    //@ts-ignore
    for (let i = 0; i < fileRef.current?.files.length; i++) {
      //@ts-ignore
      formData.append('files', fileRef.current?.files[i]);
    }

    console.log(formData);
    fetch('http://localhost:3002/files/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }).then(res => console.log(res));
  };

  return (
    <div>
      <div className="input-group">
        <label>Your name</label>
        <input
          ref={textRef}
          name="name"
          id="name"
          placeholder="Enter your name"
        />
      </div>
      <div className="input-group">
        <label htmlFor="files">Select files</label>
        <input ref={fileRef} id="files" type="file" multiple />
      </div>
      <button className="submit-btn" onClick={() => submitForm()}>
        Upload
      </button>
    </div>
  );
}
