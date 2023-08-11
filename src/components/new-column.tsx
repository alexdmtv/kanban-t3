export default function NewColumn() {
  return (
    <div className="pr-6 ">
      <div className="flex h-full w-[17.5rem] flex-col">
        {/* List Header */}
        <div className="invisible flex items-center gap-3">
          <div className="h-[15px] w-[15px] rounded-full bg-slate-600" />
          <h2 className="text-heading-s uppercase text-medium-grey">
            New Column
          </h2>
        </div>
        {/* Add new column button */}
        <button className="mt-6 grow rounded-md bg-gradient-to-b from-[#E9EFFA] to-[#E9EFFA]/50 text-heading-xl text-medium-grey hover:text-main-purple dark:from-[#2B2C37]/25 dark:to-[#2B2C37]/10">
          New column
        </button>
      </div>
    </div>
  );
}
