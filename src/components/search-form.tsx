import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchForm() {
  return (
    <form className="flex items-center gap-2 w-full">
      <Input
        type="search"
        placeholder="Search..."
        className="flex-1 h-8"
      />
      <Button type="submit" size="sm" className="h-8 px-3">
        Search
      </Button>
    </form>
  )
} 