interface Props {
  icon: string;
  onClick?: () => void;
}

const SocialIconButton = ({ icon, onClick }: Props) => {
  return (
    <div
      className="flex items-center justify-center p-3 rounded-full bg-white shadow-primary"
      onClick={onClick}
    >
      <img src={icon} alt="" className="w-[20px] h-[20px]" />
    </div>
  );
};

export default SocialIconButton;
