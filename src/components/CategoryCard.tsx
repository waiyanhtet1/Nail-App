interface Props {
  icon: string;
  title: string;
}

const CategoryCard = ({ icon, title }: Props) => {
  return (
    <div className="bg-white py-3 rounded-lg shadow flex flex-col items-center gap-3 ">
      <img src={icon} alt="" className="w-[60px] h-[60px] object-contain" />
      <p className="text-sm font-semibold text-secondary">{title}</p>
    </div>
  );
};

export default CategoryCard;
