import { h } from "vue";
import { useRoute } from "vue-router";

import AutoLink from "@theme-hope/components/AutoLink";
import { useIconPrefix, useThemeLocaleData } from "@theme-hope/composables";
import { isActiveLink } from "@theme-hope/utils";

import type { VNode } from "vue";
import type {
  ResolvedSidebarItem,
  ResolvedHopeThemeSidebarHeaderItem,
} from "../../../../shared";

export const renderIcon = (icon?: string): VNode | null =>
  icon && useThemeLocaleData().value.sidebarIcon !== false
    ? h("i", {
        class: ["icon", `${useIconPrefix().value}${icon}`],
      })
    : null;

export const renderItem = (
  config: ResolvedSidebarItem,
  props: VNode["props"]
): VNode => {
  return config.link
    ? // if the item has link, render it as `<AutoLink>`
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      h(AutoLink, {
        ...props,
        config,
      })
    : // if the item only has text, render it as `<p>`
      h("p", props, [renderIcon(config.icon), config.text]);
};

export const renderChildren = (
  children: ResolvedHopeThemeSidebarHeaderItem[]
): VNode | null => {
  const route = useRoute();
  if (!children) return null;

  return h(
    "ul",
    { class: "sidebar-sub-headers" },
    children.map((child) => {
      const active = isActiveLink(route, child.link);

      return h("li", { class: "sidebar-sub-header" }, [
        renderItem(child, {
          class: {
            "sidebar-link": true,
            heading: true,
            active,
          },
        }),
        renderChildren(child.children),
      ]);
    })
  );
};
