interface Props {
  icon: string;
  title: string;
  onClick: () => void;
}

const CategoryCard = ({ icon, title, onClick }: Props) => {
  return (
    <div
      className="h-full bg-white py-3 rounded-lg shadow flex flex-col items-center gap-3 p-3"
      onClick={onClick}
    >
      <img src={icon} alt="" className="w-[60px] h-[60px] object-contain" />
      <p className="text-sm font-semibold text-secondary text-center">
        {title}
      </p>
    </div>
  );
};

export default CategoryCard;
