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
      <img
        src={icon}
        alt=""
        className="w-[100px] h-[100px] object-cover rounded-md"
      />
      <p className="text-sm font-semibold text-secondary text-center">
        {title}
      </p>
    </div>
  );
};

export default CategoryCard;
