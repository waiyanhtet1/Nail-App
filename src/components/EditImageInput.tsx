import { IonIcon } from "@ionic/react";
import { camera, close } from "ionicons/icons";
import defaultProfile from "/images/default-profile.jpg";

interface EditImageInputProps {
  onChange: (file: FileList | null) => void;
  image: string;
  setImage: (value: string | null) => void;
}

const EditImageInput = ({ onChange, image, setImage }: EditImageInputProps) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file && file[0]) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file[0]);
      onChange(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    onChange(null);
  };

  return (
    <div className="w-full flex flex-col">
      {image ? (
        <div className=" flex justify-center">
          <div className="relative">
            <img
              src={image}
              alt="Selected"
              className="w-23 h-23 rounded-full object-cover"
            />
            <button
              className="absolute right-0 top-0 w-max bg-red-500 text-white p-1 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-400"
              onClick={removeImage}
            >
              <IonIcon icon={close} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center ">
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex items-center gap-3 relative"
          >
            <img
              src={defaultProfile}
              alt="Default Profile"
              className="w-23 h-23 rounded-full object-cover"
            />
            <div
              className="text-sm w-23 h-23 rounded-full text-secondary mt-2 absolute bottom-0 left-0 right-0 
              flex items-center justify-center"
            >
              <IonIcon icon={camera} className="size-7" />
            </div>
            <input
              type="file"
              id="image-upload"
              accept="image/png, image/jpg, image/jpeg"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default EditImageInput;
