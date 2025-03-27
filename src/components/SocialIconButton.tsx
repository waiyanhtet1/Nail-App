interface Props {
  icon: string;
}

const SocialIconButton = ({ icon }: Props) => {
  return (
    <div className="flex items-center justify-center p-3 rounded-full bg-white shadow-primary">
      <img src={icon} alt="" className="w-[20px] h-[20px]" />
    </div>
  );
};

export default SocialIconButton;
