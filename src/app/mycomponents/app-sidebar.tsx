import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

import Mysidebarheader  from "@/app/mycomponents/sidebar-header"

export function AppSidebar() {
  return (
    <Sidebar className="border-white/10 bg-slate-950 text-slate-100">
      <SidebarHeader className="border-b border-white/10"/>
      <SidebarContent className="px-6 text-slate-100">
        <SidebarGroup />
        <Mysidebarheader/>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10" />
    </Sidebar>
  )
}