import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Button, LW8CountdownBanner } from 'ui'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from 'ui/src/components/shadcn/ui/navigation-menu'
import Announcement from '~/components/Announcement/Announcement'
import ScrollProgress from '~/components/ScrollProgress'

import { useIsLoggedIn, useTheme } from 'common'
import * as supabaseLogoWordmarkDark from 'common/assets/images/supabase-logo-wordmark--dark.png'
import * as supabaseLogoWordmarkLight from 'common/assets/images/supabase-logo-wordmark--light.png'

import { data as DevelopersData } from 'data/Developers'
import DevelopersDropdown from './DevelopersDropdown'
import GitHubButton from './GitHubButton'
import HamburgerButton from './HamburgerMenu'
import MobileMenu from './MobileMenu'
import MenuItem from './MenuItem'
import ProductDropdown from './ProductDropdown'

import SolutionsData from 'data/Solutions'
import { useWindowSize } from 'react-use'

const Nav = () => {
  const { isDarkMode } = useTheme()
  const router = useRouter()
  const { width } = useWindowSize()
  const [open, setOpen] = useState(false)
  const isLoggedIn = useIsLoggedIn()

  const isHomePage = router.pathname === '/'
  const isLaunchWeekPage = router.pathname.includes('launch-week')
  const showLaunchWeekNavMode = (isLaunchWeekPage || isHomePage) && !open

  React.useEffect(() => {
    if (open) {
      // Prevent scrolling on mount
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  // Close mobile menu when desktop
  React.useEffect(() => {
    if (width >= 1024) setOpen(false)
  }, [width])

  const menu = {
    primaryNav: [
      {
        title: 'Product',
        hasDropdown: true,
        dropdown: <ProductDropdown />,
        dropdownContainerClassName: 'rounded-lg flex flex-row',
        subMenu: SolutionsData,
      },
      {
        title: 'Developers',
        hasDropdown: true,
        dropdown: <DevelopersDropdown />,
        dropdownContainerClassName: 'rounded-lg',
        subMenu: DevelopersData,
      },
      {
        title: 'Pricing',
        url: '/pricing',
      },
      {
        title: 'Docs',
        url: '/docs',
      },
      {
        title: 'Blog',
        url: '/blog',
      },
    ],
  }

  return (
    <>
      <Announcement link="/launch-week">
        <LW8CountdownBanner />
      </Announcement>

      <div className="sticky top-0 z-40 transform" style={{ transform: 'translate3d(0,0,999px)' }}>
        <div
          className={[
            'absolute inset-0 h-full w-full opacity-80 bg-scale-200',
            !showLaunchWeekNavMode && '!opacity-100 transition-opacity',
            showLaunchWeekNavMode && '!bg-transparent transition-all',
          ].join(' ')}
        />
        <nav
          className={[
            `relative z-40 border-scale-300 border-b backdrop-blur-sm transition-opacity`,
            showLaunchWeekNavMode ? '!opacity-100 !border-[#e0d2f430]' : '',
            isLaunchWeekPage && showLaunchWeekNavMode ? '!border-b-0' : '',
          ].join(' ')}
        >
          <div className="relative flex justify-between h-16 mx-auto lg:container lg:px-16 xl:px-20">
            <div className="flex items-center px-6 lg:px-0 flex-1 sm:items-stretch justify-between">
              <div className="flex items-center">
                <div className="flex items-center flex-shrink-0">
                  <Link href="/" as="/">
                    <a className="block w-auto h-6">
                      <Image
                        src={isDarkMode ? supabaseLogoWordmarkDark : supabaseLogoWordmarkLight}
                        width={124}
                        height={24}
                        alt="Supabase Logo"
                      />
                    </a>
                  </Link>

                  {isLaunchWeekPage && (
                    <Link href="/launch-week" as="/launch-week">
                      <a className="hidden ml-2 xl:block font-mono text-sm uppercase leading-4">
                        Launch Week
                      </a>
                    </Link>
                  )}
                </div>
                <NavigationMenu className="hidden pl-4 sm:space-x-4 lg:flex h-16">
                  <NavigationMenuList>
                    {menu.primaryNav.map((menuItem) =>
                      menuItem.hasDropdown ? (
                        <NavigationMenuItem className="text-sm font-medium" key={menuItem.title}>
                          <NavigationMenuTrigger className="bg-transparent data-[state=open]:text-brand data-[radix-collection-item]:focus-visible:ring-2 data-[radix-collection-item]:focus-visible:ring-foreground-lighter data-[radix-collection-item]:focus-visible:text-foreground-strong">
                            {menuItem.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className={menuItem.dropdownContainerClassName}>
                            {menuItem.dropdown}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      ) : (
                        <NavigationMenuItem className="text-sm font-medium" key={menuItem.title}>
                          <NavigationMenuLink asChild>
                            <MenuItem
                              href={menuItem.url}
                              title={menuItem.title}
                              className="group-hover:bg-transparent hover:text-brand"
                            />
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      )
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
              <div className="flex items-center gap-2">
                <GitHubButton />

                {isLoggedIn ? (
                  <Link href="/dashboard/projects">
                    <a>
                      <Button className="hidden text-white lg:block">Dashboard</Button>
                    </a>
                  </Link>
                ) : (
                  <>
                    <Link href="https://supabase.com/dashboard">
                      <a>
                        <Button type="default" className="hidden lg:block">
                          Sign in
                        </Button>
                      </a>
                    </Link>
                    <Link href="https://supabase.com/dashboard">
                      <a>
                        <Button className="hidden text-white lg:block">Start your project</Button>
                      </a>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <HamburgerButton
              toggleFlyOut={() => setOpen(true)}
              showLaunchWeekNavMode={showLaunchWeekNavMode}
            />
          </div>
          <MobileMenu open={open} setOpen={setOpen} isDarkMode={isDarkMode} menu={menu} />
        </nav>

        <ScrollProgress />
      </div>
    </>
  )
}

export default Nav
