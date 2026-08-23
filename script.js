/* =========================================================
   AMRITHA & ABHIJITH
   ENGAGEMENT INVITATION
   JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. ELEMENTS
   ========================================================= */

const openInvitationButton =
    document.getElementById("openInvitation");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const musicToggle =
    document.getElementById("musicToggle");

const screen1 =
    document.getElementById("screen1");

const screen2 =
    document.getElementById("screen2");

const screen3 =
    document.getElementById("screen3");

const screen4 =
    document.getElementById("screen4");

const countdown =
    document.getElementById("countdown");

const dayMessage =
    document.getElementById("dayMessage");

const thankYouMessage =
    document.getElementById("thankYouMessage");

const daysElement =
    document.getElementById("days");

const hoursElement =
    document.getElementById("hours");

const minutesElement =
    document.getElementById("minutes");

const secondsElement =
    document.getElementById("seconds");


/* =========================================================
   2. SETTINGS
   ========================================================= */

/*
   IMPORTANT:

   The engagement is on:

   12 September 2026

   Muhurtam:
   11:00 AM – 11:30 AM

   The timezone is India Standard Time.

   We explicitly use +05:30 so the countdown works
   correctly even if someone opens the website from
   another country.
*/

const EVENT_START =
    new Date("2026-09-12T11:00:00+05:30").getTime();

const MUHURTAM_END =
    new Date("2026-09-12T11:30:00+05:30").getTime();


/*
   Screen durations.

   These can easily be changed later.
*/

const SCREEN_2_DURATION = 7000;

const SCREEN_3_DURATION = 8000;


/*
   Used to prevent the invitation from being opened
   multiple times.
*/

let invitationOpened = false;


/*
   Music state.
*/

let musicPlaying = false;


/* =========================================================
   3. INITIAL STATE
   ========================================================= */

screen2.classList.remove("show-content");

screen3.classList.remove("show-content");

musicToggle.classList.remove("visible");


/* =========================================================
   4. OPEN INVITATION
   ========================================================= */

openInvitationButton.addEventListener(
    "click",
    openInvitation
);


function openInvitation() {

    /*
       Prevent accidental double-clicks.
    */

    if (invitationOpened) {
        return;
    }

    invitationOpened = true;


    /*
       Start music.

       Browsers generally allow audio playback after
       the user has interacted with the page, which is
       why the music begins after this button is pressed.
    */

    startMusic();


    /*
       Hide Screen 1.
    */

    screen1.classList.add("screen-leaving");


    setTimeout(() => {

        screen1.classList.remove("active-screen");

        screen1.style.display = "none";


        /*
           Show Screen 2.
        */

        screen2.classList.add("active-screen");

        screen2.classList.add("show-content");


        /*
           After Screen 2 finishes, move to Screen 3.
        */

        setTimeout(() => {

            moveToScreen3();

        }, SCREEN_2_DURATION);

    }, 900);
}


/* =========================================================
   5. SCREEN 3
   ========================================================= */

function moveToScreen3() {

    /*
       Hide Screen 2.
    */

    screen2.classList.add("screen-leaving");


    setTimeout(() => {

        screen2.classList.remove("active-screen");

        screen2.style.display = "none";


        /*
           Show Screen 3.
        */

        screen3.classList.add("active-screen");

        screen3.classList.add("show-content");


        /*
           After the couple reveal has been displayed,
           move to the scrolling invitation.
        */

        setTimeout(() => {

            moveToInvitation();

        }, SCREEN_3_DURATION);

    }, 900);
}


/* =========================================================
   6. MOVE TO SCROLLING INVITATION
   ========================================================= */

function moveToInvitation() {

    screen3.classList.add("screen-leaving");


    setTimeout(() => {

        screen3.classList.remove("active-screen");

        screen3.style.display = "none";


        /*
           Show the long invitation page.
        */

        screen4.classList.add("invitation-visible");


        /*
           Put the visitor at the beginning of
           the invitation.
        */

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });


        /*
           Allow the invitation to scroll normally.
        */

        document.body.classList.add("invitation-open");

    }, 1000);
}


/* =========================================================
   7. MUSIC
   ========================================================= */

function startMusic() {

    if (!backgroundMusic) {
        return;
    }


    backgroundMusic.volume = 0.35;


    const playPromise =
        backgroundMusic.play();


    if (playPromise !== undefined) {

        playPromise
            .then(() => {

                musicPlaying = true;

                musicToggle.classList.add("visible");

                musicToggle.classList.add("playing");

                musicToggle.setAttribute(
                    "aria-pressed",
                    "true"
                );

            })
            .catch(() => {

                /*
                   Some browsers may still block audio.

                   The music button remains available so
                   the visitor can start it manually.
                */

                musicPlaying = false;

                musicToggle.classList.add("visible");

            });
    }
}


/* =========================================================
   8. MUSIC TOGGLE
   ========================================================= */

musicToggle.addEventListener(
    "click",
    toggleMusic
);


function toggleMusic() {

    if (!backgroundMusic) {
        return;
    }


    if (musicPlaying) {

        pauseMusic();

    } else {

        playMusic();

    }
}


function playMusic() {

    backgroundMusic
        .play()
        .then(() => {

            musicPlaying = true;

            musicToggle.classList.add("playing");

            musicToggle.setAttribute(
                "aria-pressed",
                "true"
            );

        })
        .catch(() => {

            musicPlaying = false;

        });
}


function pauseMusic() {

    backgroundMusic.pause();

    musicPlaying = false;

    musicToggle.classList.remove("playing");

    musicToggle.setAttribute(
        "aria-pressed",
        "false"
    );
}


/* =========================================================
   9. PAGE VISIBILITY
   ========================================================= */

/*
   This handles the thing you specifically requested:

   If the visitor leaves the webpage/app or switches
   to another application, the music pauses.

   When they return, the music resumes.
*/

document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
);


function handleVisibilityChange() {

    if (document.hidden) {

        /*
           Only pause if music was actually playing.
        */

        if (
            backgroundMusic &&
            !backgroundMusic.paused
        ) {

            backgroundMusic.pause();

        }

    } else {

        /*
           Resume only if the invitation has already
           been opened.
        */

        if (
            invitationOpened &&
            musicPlaying
        ) {

            backgroundMusic
                .play()
                .catch(() => {});
        }
    }
);


/* =========================================================
   10. COUNTDOWN
   ========================================================= */

function updateCountdown() {

    const now =
        Date.now();


    /*
       BEFORE 11:00 AM
       ----------------

       Show the normal countdown.
    */

    if (now < EVENT_START) {

        countdown.classList.remove("hidden");

        dayMessage.classList.add("hidden");

        thankYouMessage.classList.add("hidden");


        const difference =
            EVENT_START - now;


        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        const hours =
            Math.floor(
                (difference %
                    (1000 * 60 * 60 * 24))
                /
                (1000 * 60 * 60)
            );


        const minutes =
            Math.floor(
                (difference %
                    (1000 * 60 * 60))
                /
                (1000 * 60)
            );


        const seconds =
            Math.floor(
                (difference %
                    (1000 * 60))
                /
                1000
            );


        daysElement.textContent =
            formatNumber(days);


        hoursElement.textContent =
            formatNumber(hours);


        minutesElement.textContent =
            formatNumber(minutes);


        secondsElement.textContent =
            formatNumber(seconds);


        return;
    }


    /*
       BETWEEN 11:00 AM AND 11:30 AM
       ----------------------------

       Hide countdown and show:

       "Today is the day we begin
       a beautiful new chapter."
    */

    if (
        now >= EVENT_START &&
        now < MUHURTAM_END
    ) {

        countdown.classList.add("hidden");

        thankYouMessage.classList.add("hidden");

        dayMessage.classList.remove("hidden");


        /*
           Make the message appear smoothly.
        */

        animateMessage(dayMessage);


        return;
    }


    /*
       AFTER 11:30 AM
       ---------------

       Hide countdown and first message.

       Show the final thank-you message.
    */

    if (now >= MUHURTAM_END) {

        countdown.classList.add("hidden");

        dayMessage.classList.add("hidden");

        thankYouMessage.classList.remove("hidden");


        animateMessage(thankYouMessage);

    }
}


/* =========================================================
   11. NUMBER FORMAT
   ========================================================= */

function formatNumber(number) {

    return String(number)
        .padStart(2, "0");

}


/* =========================================================
   12. MESSAGE ANIMATION
   ========================================================= */

let currentMessageState = "";


function animateMessage(element) {

    if (!element) {
        return;
    }


    const newState =
        element.id;


    /*
       Don't repeatedly restart the animation every second.
    */

    if (currentMessageState === newState) {
        return;
    }


    currentMessageState = newState;


    element.animate(
        [
            {
                opacity: 0,
                transform:
                    "translateY(15px)"
            },
            {
                opacity: 1,
                transform:
                    "translateY(0)"
            }
        ],
        {
            duration: 1200,
            easing:
                "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards"
        }
    );
}


/* =========================================================
   13. START COUNTDOWN
   ========================================================= */

updateCountdown();


setInterval(
    updateCountdown,
    1000
);


/* =========================================================
   14. RSVP BUTTON
   ========================================================= */

const rsvpButton =
    document.getElementById("rsvpButton");


if (rsvpButton) {

    rsvpButton.addEventListener(
        "click",
        function(event) {

            /*
               We don't have the RSVP destination yet.

               Prevent the button from jumping to the top
               of the page.

               Later we'll replace this with the actual
               RSVP link or WhatsApp/contact action.
            */

            event.preventDefault();

        }
    );
}


/* =========================================================
   15. SCROLL REVEAL
   ========================================================= */

/*
   Each invitation card gently appears as the visitor
   scrolls down.
*/

const invitationCards =
    document.querySelectorAll(
        ".invitation-card"
    );


const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "card-visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


invitationCards.forEach(
    (card) => {

        revealObserver.observe(card);

    }
);


/* =========================================================
   16. SAFETY FALLBACK
   ========================================================= */

/*
   If IntersectionObserver isn't available,
   simply show every card.
*/

if (
    !("IntersectionObserver" in window)
) {

    invitationCards.forEach(
        (card) => {

            card.classList.add(
                "card-visible"
            );

        }
    );
}


/* =========================================================
   17. PREVENT DOUBLE TAP ZOOM ON BUTTONS
   ========================================================= */

document
    .querySelectorAll("button")
    .forEach((button) => {

        button.addEventListener(
            "touchstart",
            () => {},
            {
                passive: true
            }
        );

    });


/* =========================================================
   END OF SCRIPT
   ========================================================= */
